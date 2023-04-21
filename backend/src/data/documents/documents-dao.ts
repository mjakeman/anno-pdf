import { Document } from '../../models/Document';

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

async function deleteDocument(id: String) {
    return Document.findByIdAndDelete(id);
}

export { createDocument, getDocuments, deleteDocument }