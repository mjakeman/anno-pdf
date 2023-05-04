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

async function deleteDocument(uuid: string) {
    return Document.findOneAndDelete({uuid: uuid});
}

async function updateDocument(uuid: string, document: any) {
    return Document.findOneAndUpdate({uuid: uuid}, document, {
        new: true
    });
}

export { createDocument, getDocuments, deleteDocument, updateDocument }