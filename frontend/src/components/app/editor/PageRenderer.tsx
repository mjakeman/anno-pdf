import {PDFPageProxy} from "pdfjs-dist/types/src/display/api";
import {fabric} from "fabric";
import React, {useEffect, useRef, useState} from "react";
import * as pdfjs from "pdfjs-dist";
import useTools from "../../../hooks/useTools";

// Required configuration option for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Props {
    page: PDFPageProxy;
}
const PageRenderer = React.memo(({ page } : Props) => {

    const [canvas, setCanvas] = useState<any>(null);
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
        canvas.setBackgroundImage(pageImg, canvas.renderAll.bind(canvas), {});
        requestAnimationFrame(draw);
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