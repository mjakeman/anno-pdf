import { Document } from '../../models/Document';
/**
 * This module is responsible for mongo queries related to the Document model.
 */


/**
 * Mongo query to get all documents for a user
 * @param user (object containing a uid and email)
 */
async function getDocuments(user: any) {
    return Document.find({
        $or: [
            {'owner.uid': user.uid},
            {'sharedWith': user.email}
        ]
    });
}

/**
 * Mongo query to get document by uuid
 *
 * @param uuid - unique document id
 */
async function getDocument(uuid: string) {
    return Document.findOne({uuid: uuid});
}

/**
 * Mongo query to create a new document entry
 *
 * @param document
 */
async function createDocument(document: any) {
    try {
        return await Document.create(document);
    } catch (e) {
        console.log(e.message);
        return null;
    }
}

/**
 * Mongo query to delete a document
 *
 * @param uuid - unique document id
 */
async function deleteDocument(uuid: string) {
    return Document.findOneAndDelete({uuid: uuid});
}

/**
 * Mongo query to update a document
 *
 * @param uuid - unique document id
 * @param document - the new data
 */
async function updateDocument(uuid: string, document: any) {
    try{
        return Document.findOneAndUpdate({uuid: uuid}, document, {new: true});
    } catch (e) {
        console.log(e.message);
        return null;
    }
}

/**
 * Mongo query to add a user to the documents sharedWith list
 *
 * @param uuid - unique document id
 * @param email - the new email to add
 */
async function addSharedUser(uuid: string, email: String) {
    return Document.findOneAndUpdate({uuid: uuid}, { $addToSet: { sharedWith: email } }, {new: true});
}

/**
 * Mongo query to remove a user from the documents sharedWith list
 *
 * @param uuid - unique document id
 * @param email - the email to remove
 */
async function removeSharedUser(uuid: string, email: String) {
    return Document.findOneAndUpdate({uuid: uuid}, { $pull: { sharedWith: email } }, {new: true});
}

export { createDocument, getDocuments, deleteDocument, updateDocument, getDocument, addSharedUser, removeSharedUser }