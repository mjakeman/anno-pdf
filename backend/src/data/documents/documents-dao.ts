import { Document } from '../../models/Document';

async function getDocuments() {
    return Document.find();
}

async function createDocument(document: any) {
    return await Document.create(document);
}

export { createDocument, getDocuments }