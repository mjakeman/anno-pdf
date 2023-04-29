import React, {useContext, useEffect, useRef, useState} from "react";
import * as pdfjs from 'pdfjs-dist';
import {PDFDocumentProxy} from "pdfjs-dist";
import {PDFPageProxy} from "pdfjs-dist/types/src/display/api";
import {useGesture} from "@use-gesture/react";
import {useHotkeys} from "react-hotkeys-hook";
import {ToolContext} from "./Editor";
import {fabric} from "fabric";
import MathObject from "./MathObject";
import {FabricJSCanvas, useFabricJSEditor} from "fabricjs-react";
import {IEvent} from "fabric/fabric-impl";

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
const SCALE_MULTIPLIER = 0.999;

const Viewer = React.memo(({ url, pageNumber }: Props) => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy>();
    const [pdfPage, setPdfPage] = useState<PDFPageProxy>();

    const lastPos = useRef({ x: 0, y: 0 });
    const isDragging = useRef(false);

    const [scale, setScale] = useState(1);
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

        return new Promise((resolve, _) => {
            const image = new Image();
            image.id = "pdfPage";
            image.src = canvas.toDataURL();
            image.onload = () => {

                const fabricImage = new fabric.Image(image, {});

                // Logging
                console.info("Created texture for page with size: ", fabricImage.width, fabricImage.height);

                resolve(fabricImage);
            }
        });
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
        renderPageToTexture(pdfPage).then((image) => {
            // Once the texture exists, queue a drawing operation when the
            // browser next repaints the page
            const fabric = fabricRef.current!;
            fabric.setBackgroundImage(image as fabric.Image, fabric.renderAll.bind(fabric), {});
            requestAnimationFrame(draw);
        });

        return;
    }, [pdfPage]);

    // Set canvas translation and zoom
    useEffect(() => {
        const canvas = fabricRef.current;
        if (canvas) {
            canvas.absolutePan(translation);
            canvas.setZoom(scale);
        }
        requestAnimationFrame(draw);
    }, [translation, scale]);

    // Drawing function
    useEffect(() => {
        requestAnimationFrame(draw);
    });

    const onMouseWheel = (opt: IEvent<WheelEvent>) => {
        const delta = opt.e.deltaY;
        const canvas = fabricRef.current!;

        // We NEED to use setScale because the current value of 'scale'
        // is stack captured by the owning closure. Who thought this was
        // a good language feature... >:(
        setScale((zoom) => {
            zoom *= SCALE_MULTIPLIER ** delta;

            if (zoom > SCALE_MAX)
                zoom = SCALE_MAX;

            if (zoom < SCALE_MIN)
                zoom = SCALE_MIN;

            opt.e.preventDefault();
            opt.e.stopPropagation();

            if (zoom < 400 / 1000) {
                translation.x = 200 - 1000 * zoom / 2;
                translation.y = 200 - 1000 * zoom / 2;
            } else {
                if (translation.x >= 0) {
                    translation.x = 0;
                } else if (translation.x < canvas.getWidth() - 1000 * zoom) {
                    translation.x = canvas.getWidth() - 1000 * zoom;
                }
                if (translation.y >= 0) {
                    translation.y = 0;
                } else if (translation.y < canvas.getHeight() - 1000 * zoom) {
                    translation.y = canvas.getHeight() - 1000 * zoom;
                }
            }

            return zoom;
        });

    };

    const onMouseDown = (opt: IEvent<MouseEvent>) => {
        const event = opt.e;
        const canvas = fabricRef.current;
        if (canvas && event.altKey) {
            isDragging.current = true;
            canvas.selection = false;
            lastPos.current = { x: event.clientX, y: event.clientY };
        }
    };

    const onMouseMove = (opt: IEvent<MouseEvent>) => {
        const event = opt.e;
        const canvas = fabricRef.current;
        if (canvas && isDragging.current) {
            setTranslation((viewport) => {
                const x = viewport.x - (event.clientX - lastPos.current.x);
                const y = viewport.y - (event.clientY - lastPos.current.y);

                lastPos.current = { x: event.clientX, y: event.clientY };

                // MUST be a new array
                // Why? Because apparently React doesn't consider the state to
                // have changed if it isn't a brand-new object. Yay for inefficiency.
                return { x, y };
            });
        }
    };

    const onMouseUp = (_: IEvent<MouseEvent>) => {
        const canvas = fabricRef.current;
        if (canvas) {
            isDragging.current = false;
            canvas.selection = true;
        }
    };

    // Startup function
    useEffect(() => {
        const dpi = window.devicePixelRatio;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width: width,
            height: height
        });

        fabricRef.current = canvas;

        canvas.on('mouse:wheel', onMouseWheel);
        canvas.on('mouse:down', onMouseDown);
        canvas.on('mouse:move', onMouseMove);
        canvas.on('mouse:up', onMouseUp);

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

        document.addEventListener('gesturestart', preventDefaultHandler)
        document.addEventListener('gesturechange', preventDefaultHandler)

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
            document.removeEventListener('gesturestart', preventDefaultHandler);
            document.removeEventListener('gesturechange', preventDefaultHandler);
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    useHotkeys('0', () => {
        setScale(1);
        setTranslation({x: 0, y: 0});
    }, [scale, translation]);

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