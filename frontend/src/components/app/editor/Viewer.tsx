import React, {useContext, useEffect, useRef, useState} from "react";
import * as pdfjs from 'pdfjs-dist';
import {PDFDocumentProxy} from "pdfjs-dist";
import {PDFPageProxy} from "pdfjs-dist/types/src/display/api";
import {useGesture} from "@use-gesture/react";
import {useHotkeys} from "react-hotkeys-hook";
import {ToolContext} from "./Editor";
import {fabric} from "fabric";
import MathObject from "./MathObject";

// Required configuration option for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// React component properties
interface Props {
    url: string;
    pageNumber: number;
}

// Constants for scale
const SCALE_MAX = 8.0;
const SCALE_MIN = 0.1;
const SCALE_STEP = 0.25;
const SCALE_MULTIPLIER = 0.8;

const Viewer = React.memo(({ url, pageNumber }: Props) => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy>();
    const [pdfPage, setPdfPage] = useState<PDFPageProxy>();

    const pdfPageTexture = useRef<fabric.Image | null>(null);
    const pdfPageAspectRatio = useRef<{w: number, h: number} | null>({w: 0, h: 0});

    const [translation, setTranslation] = useState({ x: 0, y: 0});

    const [selectedTool, setSelectedTool] = useContext(ToolContext);

    const draw = () => {
        if (!pdfPage) return;
        if (!fabricRef.current) return;

        fabricRef.current?.renderAll();
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

        const image = new Image();
        image.id = "pdfPage";
        image.src = canvas.toDataURL();

        const fabricImage = new fabric.Image(image, {});
        pdfPageTexture.current = fabricImage;

        // Logging
        console.info("Created texture for page with size: ", canvas.width, canvas.height);

        return fabricImage;
    };

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
            const fabric = fabricRef.current!;
            fabric.setBackgroundImage(pdfPageTexture.current!, fabric.renderAll.bind(fabric), {});
            requestAnimationFrame(draw);
        });

        return;
    }, [pdfPage]);

    // Startup function
    useEffect(() => {
        const dpi = window.devicePixelRatio;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width: width,
            height: height
        });

        canvas.on('mouse:wheel', function(opt) {
            var delta = opt.e.deltaY;
            var zoom = canvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
            var viewport = translation;
            if (zoom < 400 / 1000) {
                viewport.x = 200 - 1000 * zoom / 2;
                viewport.y = 200 - 1000 * zoom / 2;
            } else {
                if (viewport.x >= 0) {
                    viewport.x = 0;
                } else if (viewport.x < canvas.getWidth() - 1000 * zoom) {
                    viewport.x = canvas.getWidth() - 1000 * zoom;
                }
                if (viewport.y >= 0) {
                    viewport.y = 0;
                } else if (viewport.y < canvas.getHeight() - 1000 * zoom) {
                    viewport.y = canvas.getHeight() - 1000 * zoom;
                }
                setTranslation(viewport);
            }
        });

        fabricRef.current = canvas;

        const text = new fabric.Textbox('Hello, World!',
            {
                left: 50,
                top: 50,
                selectable: true,
                width: 300, // TODO Change initial width,
            }
        );
        const customObj = new MathObject("\\frac{n!}{k!(n-k)!} = \\binom{n}{k}", {
            left: 100,
            top: 100,
            scaleX: 4,
            scaleY: 4,
            height: 10,
            width: 30,
        });

        canvas.add(text);
        canvas.add(customObj);

        const preventDefaultHandler = (e: Event) => e.preventDefault();

        //document.addEventListener('gesturestart', preventDefaultHandler)
        //document.addEventListener('gesturechange', preventDefaultHandler)

        function handleResize() {
            const canvas = canvasRef.current;
            const fabricElement = fabricRef.current;
            if (!canvas) return;

            const newWidth = canvas.clientWidth * dpi;
            const newHeight = canvas.clientHeight * dpi;

            fabricElement?.setWidth(newWidth);
            fabricElement?.setHeight(newHeight);

            setWidth(newWidth);
            setHeight(newHeight);
        }

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            //document.removeEventListener('gesturestart', preventDefaultHandler);
            //document.removeEventListener('gesturechange', preventDefaultHandler);
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    // Drawing function
    useEffect(() => {
        requestAnimationFrame(draw);
    });

    /*useGesture(
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
    );*/

    useHotkeys('0', () => {
        fabricRef.current?.setZoom(1);
        setTranslation({x: 0, y: 0});
    }, [translation]);

    useHotkeys(['=', '+'], () => {
        if (fabricRef.current) {
            const scale = fabricRef.current.getZoom();
            fabricRef.current.setZoom(Math.min(SCALE_MAX, scale + SCALE_STEP));
        }
    });

    useHotkeys('-', () => {
        if (fabricRef.current) {
            const scale = fabricRef.current.getZoom();
            fabricRef.current.setZoom(Math.max(SCALE_MIN, scale - SCALE_STEP));
        }
    });

    return <div className="touch-none w-full h-full border-4 border-red-500 bg-zinc-300">
        <canvas ref={canvasRef}/>
    </div>;
});

export default Viewer;