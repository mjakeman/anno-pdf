import {Document} from "../models/Document";
import {debugLog} from "./controller";

/**
 * Reference to a particular page in a particular document
 */
type DocumentPageRef = {documentId: string, pageNumber: number};

/**
 * Maps DocumentPageRefs to fabric canvases
 */
type CanvasMap = Map<string, Array<Object>>;

const canvasMap: CanvasMap = new Map<string, Array<Object>>();

/**
 * Keeps track of page numbers
 */
type PageCountMap = Map<string, number>;

const pageCountMap: PageCountMap = new Map<string, number>();

/**
 * Retrieve the annotation map for a given page or create one if it
 * doesn't exist.
 *
 * @param ref Document and page number reference
 */
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

/**
 * Same as above, but overwrite it with a given value
 * @param ref Document and page number reference
 * @param objects Objects to overwrite with
 */
const setCanvasPageMap = (ref: DocumentPageRef, objects: Object[]) => {
    let string_ref = JSON.stringify(ref);
    canvasMap.set(string_ref, objects);
}

/**
 * Retrieve backfill objects for a given document
 * @param documentId Document id
 */
export const backfill = (documentId: string) => {

    const backfillMap = new Map<number, Object[]>();

    const pageNumber = pageCountMap.get(documentId) ?? 0;
    for (let i = 0; i <= pageNumber; i++) {
        const pageMap = getCanvasPageMap({documentId, pageNumber: i});
        backfillMap.set(i, pageMap);
    }

    return backfillMap;
}

/**
 * Load a PDF from Mongo
 *
 * IMPORTANT: ONLY run on first load -> use in-memory cache to avoid data loss
 *
 * @param documentId Document id
 */
export const loadPdf = async (documentId: string) => {
    debugLog(`Loading document ${documentId}`);

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

/**
 * Persist the in-memory store to MongoDB
 *
 * @param documentId Document id
 */
export const savePdf = async (documentId: string) => {
    debugLog(`Persisting document ${documentId}`);

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
        debugLog(annotations);
        document.pages.push({
            annotations: annotations,
        });
    }

    debugLog(pageCount);
    debugLog(document.pages);

    document.save()
        .then(_ => {
            debugLog("Saved document successfully");
        })
        .catch(err => {
            console.error("Failed to save document: ", err);
        })
}

/**
 * Save modification to in-memory  store
 * @param documentId Document id
 * @param pageNumber Page number
 * @param modification Modification to save
 */
export const saveModification = (documentId: string, pageNumber: number, modification: any) => {
    let objects = getCanvasPageMap({documentId, pageNumber});
    debugLog("object:")
    debugLog(objects);

    const object = objects.find(obj => (obj as any).uuid === (modification as any).uuid);

    if (!object) {
        console.error("ERROR: Could not find object for modification. Data loss may occur");
        console.error(objects);
        return;
    }

    Object.assign(object, modification);
    debugLog("Saved modification to canvas");
    setCanvasPageMap({documentId, pageNumber}, objects);
}

/**
 * Save addition to in-memory store
 * @param documentId Document id
 * @param pageNumber Page number
 * @param addition Addition to save
 */
export const saveAddition = (documentId: string, pageNumber: number, addition: any) => {
    let objects = getCanvasPageMap({documentId, pageNumber});

    objects.push(addition);

    debugLog("Saved addition to canvas");
    setCanvasPageMap({documentId, pageNumber}, objects);
}

/**
 * Action removal on in-memory store
 * @param documentId Document id
 * @param pageNumber Page number
 * @param uuid Uuid of object to remove
 */
export const saveRemoval = (documentId: string, pageNumber: number, uuid: string) => {
    let objects = getCanvasPageMap({documentId, pageNumber});
    debugLog("object:")
    debugLog(objects);

    const newObjects = objects.filter(obj => (obj as any).uuid !== uuid);

    debugLog("Saved removal to canvas");
    setCanvasPageMap({documentId, pageNumber}, newObjects);
}