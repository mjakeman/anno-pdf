import {PDFPageProxy} from "pdfjs-dist/types/src/display/api";
import {fabric} from "fabric";
import React, {useEffect, useRef, useState} from "react";
import * as pdfjs from "pdfjs-dist";
import useTools from "../../../hooks/useTools";
import SocketClient from "./socket/client";

// Required configuration option for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Props {
    page: PDFPageProxy;
    pageNumber: number;
    socketClient: SocketClient;
}
const PageRenderer = React.memo(({ page, pageNumber, socketClient } : Props) => {

    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [pageImg, setPageImg] = useState<fabric.Image | null>(null);
    useTools(canvas);

    // (1) Startup - Load the Image
    useEffect(() => {
        // Render to texture and wait for the result
        renderPageToTexture(page).then((image) => {
            setPageImg(image as fabric.Image);
        });
    }, []);

    // (2) Once the image is loaded, load the canvas
    useEffect(() => {
        if (!pageImg) return;
        const canvas = new fabric.Canvas(canvasRef.current, {
            width: pageImg.width,
            height: pageImg.height,
        });
        setCanvas(canvas);

    }, [pageImg]);

    // (3) Once the canvas is loaded, draw the actual image.
    useEffect(() => {

        if (!pageImg) return;
        if (!canvas) return;

        canvas.stateful = true;

        // Setup event handlers
        canvas.on('object:modified', (data: fabric.IEvent) => {
            socketClient.onObjectModified(pageNumber, data);
        });
        canvas.on('object:rotating', (data: fabric.IEvent) => {
            socketClient.onObjectRotating(pageNumber, data);
        });
        canvas.on('object:scaling', (data: fabric.IEvent) => {
            socketClient.onObjectScaling(pageNumber, data);
        });
        canvas.on('object:moving', (data: fabric.IEvent) => {
            socketClient.onObjectMoving(pageNumber, data);
        });
        canvas.on('object:skewing', (data: fabric.IEvent) => {
            socketClient.onObjectSkewing(pageNumber, data);
        });

        canvas.setBackgroundImage(pageImg, canvas.renderAll.bind(canvas), {});
        requestAnimationFrame(draw);

        // Teardown event handlers
        return () => {
            // Setup event handlers
            canvas.off('object:modified');
            canvas.off('object:rotating');
            canvas.off('object:scaling');
            canvas.off('object:moving');
            canvas.off('object:skewing');
        }

    }, [canvas]);

    // Drawing function(s)
    useEffect(() => {
        requestAnimationFrame(draw);
    });

    const draw = () => {
        if (!canvas) return;
        canvas.renderAll();
    };

    // Function to render the page to a texture
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

    return (
        <div className="drop-shadow-around">
            <canvas ref={canvasRef} />
        </div>
    )
});

export default PageRenderer;