import React, {useEffect, useRef, useState} from "react";
import * as pdfjs from 'pdfjs-dist';
import {PDFDocumentProxy} from "pdfjs-dist";
import {PDFPageProxy} from "pdfjs-dist/types/src/display/api";
import {useGesture} from "@use-gesture/react";
import {useHotkeys} from "react-hotkeys-hook";
import {mat4} from 'gl-matrix';

// Required configuration option for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// React component properties
interface Props {
    url: string;
    pageNumber: number;
}

const vertexShaderSource = `
  attribute vec2 aPosition;
  uniform vec2 uTranslation;
  uniform vec2 uScale;
  uniform mat4 uProjectionMatrix;
  
  attribute vec2 aTexCoord;
  varying vec2 vTexCoord;

  void main() {
    gl_Position = uProjectionMatrix * vec4((aPosition * uScale) + uTranslation, 0.0, 1.0);
    vTexCoord = aTexCoord;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform sampler2D uTexture;
  varying vec2 vTexCoord;

  void main() {
    gl_FragColor = texture2D(uTexture, vTexCoord);
  }
`;

// Constants for scale
const SCALE_MAX = 8.0;
const SCALE_MIN = 0.1;
const SCALE_STEP = 0.25;
const SCALE_MULTIPLIER = 0.8;

const Viewer = React.memo(({ url, pageNumber }: Props) => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const glContextRef = useRef<WebGLRenderingContext | null>(null);
    const glShaderProgram = useRef<WebGLShader | null>(null);

    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy>();
    const [pdfPage, setPdfPage] = useState<PDFPageProxy>();

    const pdfPageTexture = useRef<WebGLTexture | null>(null);
    const pdfPageAspectRatio = useRef<{w: number, h: number} | null>({w: 0, h: 0});

    const [scale, setScale] = useState(1);
    const [translation, setTranslation] = useState({ x: 0, y: 0});

    const initialiseWebGL = (context: WebGLRenderingContext) => {

        const gl = context;

        // |-------------------|-------------------|
        // |    -1.0    1.0    |     0.0    1.0    |
        // |    -1.0   -1.0    |     0.0    0.0    |
        // |     1.0    1.0    |     1.0    1.0    |
        // |     1.0,  -1.0    |     1.0    1.0    |
        // |-------------------|-------------------|
        // | Vertex Data (x,y) | Tex Coords (x,y)  |
        // |-------------------|-------------------|
        const vertices = [
            -1.0,  1.0,  0.0, 1.0,
            -1.0, -1.0,  0.0, 0.0,
            1.0,  1.0,  1.0, 1.0,
            1.0, -1.0,  1.0, 0.0
        ];

        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);

        const program = gl.createProgram()!;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        const aPosition = gl.getAttribLocation(program, 'aPosition');
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 16, 0);

        const aTexCoord = gl.getAttribLocation(program, 'aTexCoord');
        gl.enableVertexAttribArray(aTexCoord);
        gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 16, 8);

        gl.useProgram(program);

        glShaderProgram.current = program;

        // Create a new orthographic projection matrix
        reproject();

        const uTexture = gl.getUniformLocation(program, 'uTexture');
        gl.uniform1i(uTexture, gl.TEXTURE0);
    }

    const draw = () => {
        if (!pdfPage) return;

        if (!glContextRef.current) return;
        if (!pdfPageTexture.current) return;

        const gl = glContextRef.current;
        const program = glShaderProgram.current!;

        const uTranslation = gl.getUniformLocation(program, 'uTranslation');
        gl.uniform2f(uTranslation, translation.x, -translation.y);

        // Retrieve the aspect ratio of the page
        const {w, h} = pdfPageAspectRatio!.current!;
        const aspectRatio = h / w;
        console.log(scale * aspectRatio, scale);

        // When applying the scale, multiply the height by the aspect ratio
        // in order to preserve the original page dimensions when drawing. This
        // avoids the page looking stretched.
        const uScale = gl.getUniformLocation(program, 'uScale');
        gl.uniform2f(uScale, scale * SCALE_MULTIPLIER, scale * aspectRatio * SCALE_MULTIPLIER);

        // Clear the canvas to transparent (alpha = 0).
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const renderPageToTexture = async (page: PDFPageProxy) => {

        // Create an offscreen canvas
        const canvas = document.createElement('canvas');

        // Obtain the PDF page's scale
        const scale = 1.0;
        const viewport = page.getViewport({ scale: scale, });

        // Perform some transformations to support HiDPI screens
        const outputScale = window.devicePixelRatio || 1;

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height =  Math.floor(viewport.height) + "px";

        const transform = outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : null;

        // Retrieve the drawing context from the canvas. This is similar to how we
        // get a WebGL context, but in this case we want a plain 2d one.
        const context = canvas.getContext('2d');

        // Construct a PDF.js render context
        const renderContext = {
            canvasContext: context!,
            transform: transform!,
            viewport: viewport
        };

        // Draw it and wait for the result. This entire method is async so
        // we don't have to worry about blocking the main thread.
        await page.render(renderContext).promise;

        // Now comes the fun part. Let's turn it into a WebGL texture.

        // Retrieve a WebGL context reference
        const gl = glContextRef.current!;

        // Create a texture object on the GPU
        const texture = gl.createTexture();

        // Activate and bind it to the TEXTURE0 slot
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Flip as PDF pages are rendered "upside down"
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        // Set some sensible default texture parameters. These aren't
        // really important.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // Upload the Canvas's image data to the WebGL texture.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

        // And equivalently update our stored references to point to the texture
        // and its dimensions. Note we use references rather than state here; we do
        // not want to re-render at this point.
        pdfPageTexture.current = texture;
        pdfPageAspectRatio.current = { w: canvas.width, h: canvas.height };

        // Logging
        console.info("Created texture for page with size: ", canvas.width, canvas.height);

        return texture;
    };

    // Create an orthographic projection matrix to preserve aspect ratio
    // while drawing.
    const reproject = () => {

        const gl = glContextRef.current;
        if (!gl) return;

        const canvas = gl.canvas;
        const aspectRatio = canvas.width / canvas.height;

        // Create an orthographic projection matrix. Explaining this is out-of-scope
        // however the library 'gl-matrix' does all the magic, we just provide the screen
        // bounds (i.e.g from -1 to +1 in each of the X, Y, Z axis).
        const projectionMatrix = mat4.create();
        mat4.ortho(projectionMatrix, -1.0, 1.0, -1.0 / aspectRatio, 1.0 / aspectRatio, -1.0, 1.0);

        // Pass the projection matrix to our shader program. This lets the shader decide
        // where to draw.
        const projectionMatrixLocation = gl.getUniformLocation(glShaderProgram.current!, "uProjectionMatrix");
        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
    }

    // Load the PDF Document.
    useEffect(() => {
        const loadingTask = pdfjs.getDocument(url);
        loadingTask.promise.then(function(pdf) {
            setPdfDocument(pdf);
        });
    }, [url]);

    // Load a given PDF page
    useEffect(() => {
        const pdf = pdfDocument;
        if (!pdf) return;

        pdf.getPage(pageNumber).then(function(page) {
            setPdfPage(page);
        });
    }, [pdfDocument, pageNumber]);

    // Renders the current PDF page to a texture
    useEffect(() => {
        if (!pdfPage) return;

        // Render to texture and wait for the result
        renderPageToTexture(pdfPage).then(() => {
            // Once the texture exists, queue a drawing operation when the
            // browser next repaints the page
            requestAnimationFrame(draw);
        });

        return;
    }, [pdfPage]);

    // Startup function
    useEffect(() => {
        const dpi = window.devicePixelRatio;

        const preventDefaultHandler = (e: Event) => e.preventDefault();

        document.addEventListener('gesturestart', preventDefaultHandler)
        document.addEventListener('gesturechange', preventDefaultHandler)

        function handleResize() {
            const canvas = canvasRef.current;
            if (!canvas) return;

            canvas.width = canvas.clientWidth * dpi;
            canvas.height = canvas.clientHeight * dpi;

            setWidth(canvas.width);
            setHeight(canvas.height);

            const gl = glContextRef.current;
            if (!gl) return;

            reproject();

            gl.viewport(0, 0, canvas.width, canvas.height);
        }

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            document.removeEventListener('gesturestart', preventDefaultHandler);
            document.removeEventListener('gesturechange', preventDefaultHandler);
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    // Drawing function
    useEffect(() => {
        requestAnimationFrame(draw);
    });

    useGesture(
        {
            onDrag: ({ down, offset: [sx, sy] }) => {
                if (down) {
                    setTranslation({x: sx, y: sy});
                }
            },
            onPinch: ({ offset: [scale], last }) => {
                if (!last) {
                    setScale(scale);
                }
            },
        },
        {
            target: canvasRef,
            eventOptions: { passive: false },
            drag: {
                bounds: {
                    left: -Math.max(1, scale),
                    right: Math.max(1, scale),
                    top: -Math.max(1, scale),
                    bottom: Math.max(1, scale)
                },
                from: () => [translation.x, translation.y],
                transform: ([x, y]) => [(x / width) * 4, (y / height) * 4],
                preventDefault: true
            },
            pinch: {
                scaleBounds: { min: SCALE_MIN, max: SCALE_MAX },
                from: () => [scale, 0],
                preventDefault: true
            }
        }
    );

    useHotkeys('0', () => {
        setScale(1.0);
        setTranslation({x: 0, y: 0});
    }, [translation, scale]);

    useHotkeys(['=', '+'], () => {
        setScale(scale => Math.min(SCALE_MAX, scale + SCALE_STEP));
    }, [translation, scale]);

    useHotkeys('-', () => {
        setScale(scale => Math.max(SCALE_MIN, scale - SCALE_STEP));
    }, [translation, scale]);

    return <canvas
        className="touch-none w-full h-full border-4 border-red-500 bg-zinc-300"
        ref={(element) => {
            if (element) {
                const gl = element.getContext('webgl2')!;
                glContextRef.current = gl;
                canvasRef.current = element;
                initialiseWebGL(gl);
            }
        }}
    />;
});

export default Viewer;