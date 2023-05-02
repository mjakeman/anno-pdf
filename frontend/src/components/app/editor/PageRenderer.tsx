import {PDFPageProxy} from "pdfjs-dist/types/src/display/api";
import {fabric} from "fabric";
import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import * as pdfjs from "pdfjs-dist";
import useTools from "../../../hooks/useTools";
import SocketClient from "./socket/client";
import {Canvas, Object} from "fabric/fabric-impl";
import {v4 as uuidv4} from "uuid";

// Required configuration option for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Props {
    page: PDFPageProxy;
    pageNumber: number;
    socketClientRef: MutableRefObject<SocketClient>;
}
const PageRenderer = React.memo(({ page, pageNumber, socketClientRef } : Props) => {

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

    const enableEvents = (canvas: fabric.Canvas) => {
        // Setup event handlers
        canvas.on('object:modified', data => {
            const socketClient = socketClientRef.current;
            socketClient.onObjectModified(pageNumber, data);
        });
        canvas.on('object:added', data => {
            const uuid = uuidv4();
            // @ts-ignore
            data.target['id'] = uuid;

            const socketClient = socketClientRef.current;
            socketClient.onObjectAdded(pageNumber, uuid, data.target!);
        });
    }

    const disableEvents = (canvas: fabric.Canvas) => {
        // Setup event handlers
        canvas.off('object:modified');
        canvas.off('object:added');
    }

    // Prevent loop feedback when processing events from the server (i.e. avoiding triggering
    // an object:added event ourselves, which will recursively call the server and so on).
    const runWithEventsFrozen = (canvas: Canvas, fn: () => void) => {
        disableEvents(canvas);
        fn();
        enableEvents(canvas);
    }

    // (3) Once the canvas is loaded, draw the actual image.
    useEffect(() => {

        if (!pageImg) return;
        if (!canvas) return;

        const socketClient = socketClientRef.current;
        socketClient.registerPage(pageNumber, {
            objectAddedFunc: (uuid, data) => {
                runWithEventsFrozen(canvas, () => {
                    console.log("Addition received from peer")
                    console.log(data);
                    console.log(uuid);
                    console.log('\n');

                    // @ts-ignore
                    data['id'] = uuid;

                    fabric.util.enlivenObjects([data], function (enlivenedObjects: fabric.Object[]) {
                        const newObj = enlivenedObjects[0];
                        newObj.opacity = 0;
                        newObj.animate('opacity', 1, {
                            duration: 500,
                            onChange: canvas.renderAll.bind(canvas),
                            easing: fabric.util.ease['easeInQuad']
                        });

                        canvas.add(newObj);
                        canvas.renderAll();
                    }, '', undefined);
                    canvas.renderAll();
                });
            },
            objectModifiedFunc: (uuid, data) => {
                runWithEventsFrozen(canvas, () => {
                    console.log("Modification received from peer")
                    console.log(data);
                    console.log(uuid);
                    console.log('\n');

                    var found = false;

                    canvas.forEachObject(object => {

                        // @ts-ignore
                        const cmp_uuid = object['id'];
                        console.log(cmp_uuid);

                        if (uuid === cmp_uuid) {

                            const dummyFadeOut = fabric.util.object.clone(object);
                            object.set(data);

                            dummyFadeOut.opacity = 1;
                            object.opacity = 0;

                            dummyFadeOut.animate('opacity', 0, {
                                duration: 500,
                                onChange: canvas.renderAll.bind(canvas),
                                onComplete: canvas.remove.bind(dummyFadeOut),
                                easing: fabric.util.ease['easeInQuad']
                            });

                            object.animate('opacity', 1, {
                                duration: 300,
                                onChange: canvas.renderAll.bind(canvas),
                                easing: fabric.util.ease['easeInQuad']
                            });

                            // @ts-ignore
                            object['id'] = uuid;

                            object.setCoords();
                            canvas.renderAll();

                            found = true;
                        }
                    });

                    if (!found)
                        console.error("Did not find object to modify - lost data?");
                });
            },
        });

        canvas.stateful = true;

        // Setup event handlers
        enableEvents(canvas);

        canvas.setBackgroundImage(pageImg, canvas.renderAll.bind(canvas), {});
        requestAnimationFrame(draw);

        // Teardown event handlers
        return () => {
            disableEvents(canvas);
            socketClient.unregisterPage(pageNumber);
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