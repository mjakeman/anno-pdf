import { Document } from '../../models/Document';

/**
 * 
 * This class is responsible for testing Document model. It tests many of the methods associated
 * with the model.
 */

async function getDocuments(user: any) {
    return Document.find({
        $or: [
            {'owner.uid': user.uid},
            {'sharedWith': user.email}
        ]
    });
}

async function getDocument(uuid: string) {
    return Document.findOne({uuid: uuid});
}

async function createDocument(document: any) {
    try {
        return await Document.create(document);
    } catch (e) {
        console.log(e.message);
        return null;
    }
}

async function deleteDocument(uuid: string) {
    return Document.findOneAndDelete({uuid: uuid});
}

async function updateDocument(uuid: string, document: any) {
    try{
        return Document.findOneAndUpdate({uuid: uuid}, document, {new: true});
    } catch (e) {
        console.log(e.message);
        return null;
    }
}

async function addSharedUser(uuid: string, email: String) {
    return Document.findOneAndUpdate({uuid: uuid}, { $addToSet: { sharedWith: email } }, {new: true});
}

async function removeSharedUser(uuid: string, email: String) {
    return Document.findOneAndUpdate({uuid: uuid}, { $pull: { sharedWith: email } }, {new: true});
}

export { createDocument, getDocuments, deleteDocument, updateDocument, getDocument, addSharedUser, removeSharedUser }