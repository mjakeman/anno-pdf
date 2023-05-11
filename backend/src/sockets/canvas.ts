import {Document} from "../models/Document";

type DocumentPageRef = {documentId: string, pageNumber: number};

// Maps DocumentPageRefs to fabric canvases
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

export const backfill = (documentId: string) => {

    const backfillMap = new Map<number, Object[]>();

    const pageNumber = pageCountMap.get(documentId) ?? 0;
    for (let i = 0; i <= pageNumber; i++) {
        const pageMap = getCanvasPageMap({documentId, pageNumber: i});
        backfillMap.set(i, pageMap);
    }

    return backfillMap;
}

// ONLY run on first load -> use in-memory cache to avoid data loss
export const loadPdf = async (documentId: string) => {
    console.log(`Loading document ${documentId}`);

    // Populate canvas page map with data from mongo
    const document = await Document.findOne({uuid: documentId});

    if (!document) {
        console.error(`Document ${documentId} is NULL`);
        return;
    }

    document.pages.forEach((pages, pageNumber) => {
        setCanvasPageMap({documentId, pageNumber}, pages.annotations);
    })

    pageCountMap.set(documentId, document.pages.length);
}

export const savePdf = async (documentId: string) => {
    console.log(`Persisting document ${documentId}`);

    const document = await Document.findOne({uuid: documentId});

    if (!document) {
        console.error(`Document ${documentId} is NULL`);
        return;
    }

    // Clear mongo pages
    document.pages = [];

    // Overwrite with in-memory data
    const pageCount = pageCountMap.get(documentId) ?? 0;
    for (let i = 0; i <= pageCount; i++) {
        const annotations = getCanvasPageMap({documentId, pageNumber: i});
        console.log(annotations);
        document.pages.push({
            annotations: annotations,
        });
    }

    console.log(pageCount);
    console.log(document.pages);

    document.save()
        .then(_ => {
            console.log("Saved document successfully");
        })
        .catch(err => {
            console.error("Failed to save document: ", err);
        })
}

export const saveModification = (documentId: string, pageNumber: number, modification: any) => {
    let objects = getCanvasPageMap({documentId, pageNumber});
    console.log("object:")
    console.log(objects);

    const object = objects.find(obj => (obj as any).uuid === (modification as any).uuid);

    if (!object) {
        console.error("ERROR: Could not find object for modification. Data loss may occur");
        console.error(objects);
        return;
    }

    Object.assign(object, modification);
    console.log("Saved modification to canvas");
    setCanvasPageMap({documentId, pageNumber}, objects);
}

export const saveAddition = (documentId: string, pageNumber: number, addition: any) => {
    let objects = getCanvasPageMap({documentId, pageNumber});

    objects.push(addition);

    console.log("Saved addition to canvas");
    setCanvasPageMap({documentId, pageNumber}, objects);
}

export const saveRemoval = (documentId: string, pageNumber: number, uuid: string) => {
    let objects = getCanvasPageMap({documentId, pageNumber});
    console.log("object:")
    console.log(objects);

    const newObjects = objects.filter(obj => (obj as any).uuid !== uuid);

    console.log("Saved removal to canvas");
    setCanvasPageMap({documentId, pageNumber}, newObjects);
}