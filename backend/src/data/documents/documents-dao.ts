import { Document } from '../../models/Document';
import mongoose from "mongoose";

async function getDocuments(userId: String) {
    return Document.find({
        $or: [
            {createdBy: userId},
            {sharedWith: userId}
        ]
    });
}

async function createDocument(document: any) {
    return await Document.create(document);
}

async function deleteDocument(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)) return null;

    return Document.findByIdAndDelete(id);
}

async function updateDocument(id: string, document: any) {
    if(!mongoose.Types.ObjectId.isValid(id)) return null;

    return Document.findByIdAndUpdate(id, document, {
        new: true
    });
}

export { createDocument, getDocuments, deleteDocument, updateDocument }