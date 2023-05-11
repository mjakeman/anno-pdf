import {Document} from "../models/Document";

type DocumentPageRef = {documentId: string, pageNumber: number};

// Maps documents to fabric canvases
type CanvasMap = Map<string, Array<Object>>;

const canvasMap: CanvasMap = new Map<string, Array<Object>>();

// Keeps track of page numbers
type PageCountMap = Map<string, number>;

const pageCountMap: PageCountMap = new Map<string, number>();

const getCanvasPageMap = (ref: DocumentPageRef) => {

    // Store up-to-date page count
    if (pageCountMap.has(ref.documentId)) {
        const currentPageCount = pageCountMap.get(ref.documentId)!;
        if (ref.pageNumber > currentPageCount) {
            pageCountMap.set(ref.documentId, ref.pageNumber);
        }
    } else {
        pageCountMap.set(ref.documentId, ref.pageNumber);
    }

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

export const savePdf = async (documentId: string) => {
    console.log(`Persisting document ${documentId}`);
    // const pageCount = pageCountMap.get(documentId) ?? 0;
    const document = await Document.findOne({uuid: documentId});
    if (!document) {
        console.error(`Document ${documentId} is NULL`);
        return;
    }

    //const leftover = pageCount - document.pages.length;
    /*for (const page of document.pages) {
        const annotations = getCanvasPageMap({documentId, pageNumber: i});
        Object.assign(page.annotations, annotations);
    }*/
    // Add pages which do not already exist - can we clear and re-add?
    /*for (let i = 0; i < pageCount; i++) {
        const annotations = getCanvasPageMap({documentId, pageNumber: i});
        const page = document.pages[i];
        if (page) {
            Object.assign(page.annotations, annotations);
        } else if {
            document.pages[i] =
        }


    }*/

    await document.save();
}

export const saveModification = (documentId: string, pageNumber: number, uuid: string, modification: Object) => {
    let objects = getCanvasPageMap({documentId, pageNumber});
    console.log("object:")
    console.log(objects);

    // @ts-ignore
    const object = objects.find(obj => obj['uuid'] === uuid);

    if (!object) {
        console.error("ERROR: Could not find object for modification. Data loss may occur");
        console.error(objects);
        return;
    }

    Object.assign(object, modification);
    console.log("Saved modification to canvas");
    setCanvasPageMap({documentId, pageNumber}, objects);
}

export const saveAddition = (documentId: string, pageNumber: number, uuid: string, addition: Object) => {
    let objects = getCanvasPageMap({documentId, pageNumber});

    // @ts-ignore
    addition['uuid'] = uuid;
    objects.push(addition);

    console.log("Saved addition to canvas");
    setCanvasPageMap({documentId, pageNumber}, objects);
}