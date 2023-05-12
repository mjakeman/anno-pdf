import {PDFPageProxy} from "pdfjs-dist/types/src/display/api";
import {fabric} from "fabric";
import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import * as pdfjs from "pdfjs-dist";
import useTools from "../../../hooks/useTools";
import SocketClient from "./socket/client";
import {Canvas, Object, Transform} from "fabric/fabric-impl";
import {v4 as uuidv4} from "uuid";
import {AnnoDocument} from "./Models";

// Required configuration option for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Props {
    onLoad: (pageNumber: number) => void
    page: PDFPageProxy;
    pageIndex: number;
    doc: AnnoDocument;
    socketClientRef: MutableRefObject<SocketClient>;
}
const PageRenderer = React.memo(({ onLoad, page, pageIndex, doc, socketClientRef } : Props) => {

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

        // If we've already set canvas when a pageImg loads, then we are zooming.
        if (canvas) {
            canvas.setBackgroundImage(pageImg, canvas.renderAll.bind(canvas), {});
            requestAnimationFrame(draw);
            return;
        }

        // Otherwise, if the canvas is NOT already set, then we need to create a new canvas
        const newCanvas = new fabric.Canvas(canvasRef.current, {
            width: pageImg.width,
            height: pageImg.height,
        });

        doc.pages[pageIndex] = newCanvas;

        setCanvas(newCanvas);
        onLoad(pageIndex);

    }, [pageImg]);

    const enableEvents = (canvas: fabric.Canvas) => {
        // Setup event handlers
        canvas.on('object:modified', data => {
            const socketClient = socketClientRef.current;
            socketClient.onObjectModified(pageIndex, data);
        });
        canvas.on('object:added', data => {
            const uuid = uuidv4();
            // @ts-ignore
            data.target['uuid'] = uuid;

            const socketClient = socketClientRef.current;
            socketClient.onObjectAdded(pageIndex, data.target!);
        });
        canvas.on('object:removed', data => {
            const socketClient = socketClientRef.current;
            socketClient.onObjectRemoved(pageIndex, data.target!);
        })

        // Setup Delete Event Handler
        window.addEventListener('keyup',removeObjectOnDeleteKeyPress)
    }

    const disableEvents = (canvas: fabric.Canvas) => {
        // Setup event handlers
        canvas.off('object:modified');
        canvas.off('object:added');
        canvas.off('object:selected')
        window.removeEventListener('keyup', removeObjectOnDeleteKeyPress)
    }

    // Prevent loop feedback when processing events from the server (i.e. avoiding triggering
    // an object:added event ourselves, which will recursively call the server and so on).
    const runWithEventsFrozen = (canvas: Canvas, fn: () => void) => {
        disableEvents(canvas);
        fn();
        enableEvents(canvas);
    }

    const removeObjectOnDeleteKeyPress = (e: KeyboardEvent) => {
        if (!canvas) return;
        if ( e.key == 'Delete' || e.code == 'Delete' || e.key == 'Backspace') {
            const activeObj = canvas.getActiveObject();

            if (activeObj instanceof fabric.IText && activeObj.isEditing) return;

            canvas.getActiveObjects().forEach((obj) => {
                canvas.remove(obj);
            });
            canvas.discardActiveObject().renderAll();
        }
    }

    // (3) Once the canvas is loaded, draw the actual image.
    useEffect(() => {

        if (!pageImg) return;
        if (!canvas) return;

        const socketClient = socketClientRef.current;
        socketClient.registerPage(pageIndex, {
            objectAddedFunc: data => {
                runWithEventsFrozen(canvas, () => {
                    try {
                        console.log("Attempting to enliven object:");
                        console.log(data);

                        fabric.util.enlivenObjects([data], function (enlivenedObjects: any[]) {

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
                    } catch (error) {
                        console.error(error);
                    }
                    canvas.renderAll();
                });
            },
            objectModifiedFunc: data => {
                runWithEventsFrozen(canvas, () => {
                    console.log("Modification received from peer")

                    const uuid = (data as any).uuid;

                    console.log(data);
                    console.log(uuid);
                    console.log('\n');

                    let found = false;

                    canvas.forEachObject(object => {

                        if ((object as any).uuid === uuid) {

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

                            (object as any).uuid = uuid;

                            object.setCoords();
                            canvas.renderAll();

                            found = true;
                        }
                    });

                    if (!found)
                        console.error("Did not find object to modify - lost data?");
                });
            },
            objectRemovedFunc: uuid => {
                runWithEventsFrozen(canvas, () => {
                    console.log("Removal received from peer")

                    let found = false;

                    canvas.forEachObject(object => {

                        if ((object as any).uuid === uuid) {

                            canvas.remove(object);
                            canvas.renderAll();

                            found = true;
                        }
                    });

                    if (!found)
                        console.error("Did not find object to remove - lost data?");
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
            socketClient.unregisterPage(pageIndex);
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
            <canvas className="drop-shadow-around" ref={canvasRef} />
    )
});

export default PageRenderer;

// Delete Icon functionality - Adapted directly from http://fabricjs.com/custom-control-render
let deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

let img = document.createElement('img');
img.src = deleteIcon;

fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: -16,
    offsetX: 16,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderIcon,
});
function deleteObject(eventData: MouseEvent, transformData: Transform): boolean {
    let target = transformData.target;
    let canvas = target.canvas;
    canvas?.getActiveObjects().forEach((obj) => {
        canvas?.remove(obj);
    });
    canvas?.discardActiveObject().renderAll();
    return true;
}

function renderIcon(ctx: CanvasRenderingContext2D, left: number, top: number, styleOverride: any, fabricObject: Object) {
    let size = 20;
    ctx.save();
    ctx.translate(left, top);
    if (fabricObject.angle != null) {
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    }
    ctx.drawImage(img, -size/2, -size/2, size, size);
    ctx.restore();
}