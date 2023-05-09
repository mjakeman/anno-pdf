// This is madness

// import {StaticCanvas} from "fabric/fabric-impl";
// import {fabric} from "fabric";

type DocumentPageRef = {documentId: string, pageNumber: number};

// Maps documents to fabric canvases
type CanvasMap = Map<string, Array<Object>>;

const canvasMap: CanvasMap = new Map<string, Array<Object>>();

/*const makePage = (width: number, height: number) => {
    let canvas = new StaticCanvas(null, {
        width: width,
        height: height,
        backgroundColor: 'white', // TODO REMOVE BG COLOR
    });

    return canvas;
}

const retrievePage = (documentId: string, pageNumber: number) => {
    const pages = canvasMap[documentId];

    // Note: Pages start at 1
    if (pageNumber > pages.length) {
        for (let i = pages.length; i < pageNumber; i++) {
            canvasMap[documentId][i] = makePage(800, 800);

            // TODO: Backfill from database
        }
    }

    return pages[pageNumber-1];
}*/

const getCanvasPageMap = (ref: DocumentPageRef) => {
    let string_ref = JSON.stringify(ref);
    let objects = canvasMap.get(string_ref);
    if (!objects) {
        objects = [];
        canvasMap.set(string_ref, objects);
    }

    return objects;
}

const setCanvasPageMap = (ref: DocumentPageRef, objects: Object[]) => {
    let string_ref = JSON.stringify(ref);
    canvasMap.set(string_ref, objects);
}

export const backfill = (documentId: string, pageNumber: number) => {
    return getCanvasPageMap({documentId, pageNumber});
}

export const saveModification = (documentId: string, pageNumber: number, uuid: string, modification: Object) => {
    let objects = getCanvasPageMap({documentId, pageNumber});
    console.log("object:")
    console.log(objects);

    // @ts-ignore
    const obj_index = objects.indexOf(obj => obj['uuid'] === uuid);

    if (obj_index == -1) {
        console.error("ERROR: Could not find object for modification. Data loss may occur");
        console.log(objects);
        return;
    }

    objects[obj_index] = modification;
    console.log("Saved modification to canvas");
    setCanvasPageMap({documentId, pageNumber}, objects);
}

export const saveAddition = (documentId: string, pageNumber: number, uuid: string, addition: Object) => {
    let objects = getCanvasPageMap({documentId, pageNumber});

    // @ts-ignore
    addition['uuid'] = uuid;
    objects.push(addition);

    // fabric.util.enlivenObjects([addition], canvas.add.bind(canvas), '', undefined);
    console.log("Saved addition to canvas");
    setCanvasPageMap({documentId, pageNumber}, objects);
}