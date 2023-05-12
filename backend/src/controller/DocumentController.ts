import {NextFunction, Request, Response} from 'express';
import Busboy from 'busboy';
import {
    addSharedUser,
    createDocument,
    deleteDocument,
    getDocument,
    removeSharedUser,
    updateDocument
} from "../data/documents/documents-dao";
import s3 from "../s3/s3Config";
import Config from "../util/Config";
import {v4 as uuidv4} from 'uuid';
import {EmailService} from "../service/EmailService";
import {getUser, getUsersByEmailList} from "../data/users/users-dao";

const emailService = new EmailService();

/**
 * Controller for handling document-related operations
 */
class DocumentController {

    /**
     * Deletes a document from the database and S3 bucket
     *
     * @param req - Express request object containing document UUID in URL params
     * @param res - Express response object
     */
    deleteDocument = async (req: Request, res: Response) => {
        const currentUserUid = req.user!.uid;

        const dbDoc = await deleteDocument(req.params.uuid);
        if (!dbDoc) {
            return res.status(404).send('Document not found');
        }

        // Check if the current user is the owner of the document
        if (dbDoc.owner!.uid !== currentUserUid) {
            return res.status(403).send('You do not have the permissions to delete this document');
        }

        // Delete object from s3 bucket
        const s3Key = toS3Key(dbDoc.uuid);
        const params = {
            Bucket: Config.AWS_BUCKET,
            Key: s3Key,
        };

        try {
            await s3.deleteObject(params).promise();
        } catch (e) {
            console.log(e.message);
            return res.status(500).send("Error deleting document from s3");
        }

        return res.status(200).send('Document deleted from mongo and s3 - Title: ' + dbDoc.title);
    }

    /**
     * Retrieves a document from the database and S3 bucket, and sends it as a response with base64-encoded PDF
     *
     * @param req - Express request object containing document UUID in URL params
     * @param res - Express response object
     */
    getDocument = async (req: Request, res: Response) => {
        // Retrieve document from the database
        const dbDoc = await getDocument(req.params.uuid);
        if (!dbDoc) {
            return res.status(404).send('Document not found');
        }

        // Retrieve object from s3 bucket
        const s3Key = toS3Key(dbDoc.uuid);
        const params = {
            Bucket: Config.AWS_BUCKET,
            Key: s3Key,
        };

        try {
            const s3Document = await s3.getObject(params).promise();
            if (!s3Document.Body) throw Error("s3 document 'Data' was null");

            // Convert the PDF to base64 and add it to the document JSON
            const base64pdf = s3Document.Body.toString('base64');
            const documentJson = JSON.parse(JSON.stringify(dbDoc));
            documentJson['base64file'] = base64pdf;

            // Retrieve the list of users that the document is shared with
            documentJson['sharedWith'] = await getUsersByEmailList(documentJson.sharedWith);
            return res.send(documentJson);
        } catch (e) {
            console.log(e.message);
            return res.status(500).send("Error fetching document from s3");
        }
    }


    /**
     * Updates a document in MongoDB and returns the updated document
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - The updated document or an error response
     */
    updateDocument = async (req: Request, res: Response) => {
        // Get the document from MongoDB
        const dbDoc = await getDocument(req.params.uuid);
        if (!dbDoc) {
            return res.status(404).send('Document not found');
        }

        const data = req.body;
        data['lastUpdatedBy'] = req.user!.uid;
        const updatedDoc = await updateDocument(req.params.uuid, data);

        if (updatedDoc) {
            return res.status(200).json(updatedDoc);
        }

        return res.status(404).send('Document not found');
    }


    /**
     * Creates a new document and uploads it to Amazon S3 and MongoDB
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - The created document or an error response
     */
    createAndUploadDocument = async (req: Request, res: Response) => {
        const dbUser = await getUser(req.user!.uid);
        if (!dbUser) {
            return res.status(500).send('Error fetching user details');
        }

        let busboy;
        try {
            busboy = Busboy({ headers: req.headers });
        } catch (e) {
            return res.status(500).send(e.message);
        }

        busboy.on('file', async (_fieldname: any, file: any, info: any)=> {
            if (info.mimeType !== 'application/pdf') {
                return res.status(400).send("Invalid file type, only pdf files are supported.");
            }

            const id = uuidv4();
            const s3Key = toS3Key(id);
            const params = {
                Bucket: Config.AWS_BUCKET,
                Key: s3Key,
                Body: file
            };

            const upload = await s3.upload(params).promise();
            console.log('Upload to s3 successful: ', upload.Location);

            const dbDoc = await createDocument({
                owner: {
                    uid: dbUser.uid,
                    email: dbUser.email,
                    name: dbUser.name
                },
                title: info.filename,
                uuid: id,
                sharedWith: [],
                annotations: {},
            });

            if (dbDoc) {
                console.log('Document created in MongoDB - Title: ' + dbDoc.title);
                return res.status(201).json(dbDoc);
            }

            return res.sendStatus(422);
        })

        return req.pipe(busboy);
    }
    
    /**
        Copies a document to a new UUID and adds it to the MongoDB database and Amazon S3 bucket.
        @param {Request} req - The HTTP request object containing the user's Firebase UID and the UUID of the document to copy.
        @param {Response} res - The HTTP response object that will be returned to the client.
        @returns {Response} - Returns a response with a JSON object containing the UUID and metadata of the new document, or a status code and error message if there was an issue.
    */
    copyDocument = async (req: Request, res: Response) =>  {
        const dbUser = await getUser(req.user!.uid);
        if (!dbUser) {
            return res.status(500).send('Error fetching user details');
        }

        const docToCopy = await getDocument(req.params.uuid);
        if (!docToCopy) {
            return res.status(404).send('Document not found');
        }

        const id = uuidv4();
        const s3Key = toS3Key(id);

        // create a copy in s3
        const params = {
            CopySource: `${Config.AWS_BUCKET}/${toS3Key(docToCopy.uuid)}`,
            Bucket: Config.AWS_BUCKET,
            Key: s3Key,
        };
        await s3.copyObject(params).promise();
        console.log('Copy made in s3 successfully');

        // Create a copy in mongo
        const data = {
            owner: {
                uid: dbUser.uid,
                email: dbUser.email,
                name: dbUser.name
            },
            title: `Copy of ${docToCopy.title}`,
            uuid: id,
            sharedWith: [],
            annotations: []
        }
        const dbDoc = await createDocument(data);

        if (dbDoc) {
            console.log('Document copy created in MongoDB - Title: ' + dbDoc.title);
            req.params.uuid = dbDoc.uuid;
            return this.getDocument(req, res);
        }

        return res.sendStatus(422);
    }

    /**
        Shares a document with a user by adding their email to the "sharedWith" array in MongoDB and sending them an email invite.
        @param {Request} req - The HTTP request object containing the user's Firebase UID, the UUID of the document to share, and the email address of the user to share with.
        @param {Response} res - The HTTP response object that will be returned to the client.
        @returns {Response} - Returns a response with a JSON object containing the updated document metadata, or a status code and error message if there was an issue.
    */
    shareDocument = async (req: Request, res: Response) => {
        if (!req.body.email) {
            return res.status(400).send('"email" field is required in the request body');
        }

        if (this.isUserSharingOrRemovingThemselves(req.user!.email, req.body.email)) {
            return res.status(400).send('Trying to share/remove own user from document');
        }

        const updatedDoc = await addSharedUser(req.params.uuid, req.body.email);

        // send invite email
        const emailSent = await emailService.sendEmail(req.params.uuid, req.body.email, req.user!.email)
        if (emailSent) {
            console.log(`Document shared: email sent to ${req.body.email}`);
        } else {
            console.log(`Error sending invite email to ${req.body.email}`);
        }

        return res.json(updatedDoc);
    }

    removeUserFromDocument = async (req: Request, res: Response)  => {
        if (!req.body.email) {
            return res.status(400).send('"email" field is required in the request body');
        }

        if (this.isUserSharingOrRemovingThemselves(req.user!.email, req.body.email)) {
            return res.status(400).send('Trying to share/remove own user from document');
        }

        const updatedDoc = await removeSharedUser(req.params.uuid, req.body.email);
        return res.json(updatedDoc);
    }

    checkDocumentViewingPermissions = async (req: Request, res: Response, next: NextFunction) => {
        const dbDoc = await getDocument(req.params.uuid);
        if (!dbDoc) {
            return res.status(404).send('Document not found');
        }

        const { uid, email } = req.user!;
        if (!this.hasViewingPermissions(dbDoc, uid, email)) {
            console.log('User does not have viewing perms');
            return res.status(403).send('Insufficient permissions (Viewing)');
        }

        return next();
    }

    checkDocumentOwnerPermissions = async (req: Request, res: Response, next: NextFunction) => {
        const dbDoc = await getDocument(req.params.uuid);
        if (!dbDoc) {
            return res.status(404).send('Document not found');
        }

        const uid = req.user!.uid;
        if (dbDoc.owner!.uid !== uid) {
            console.log('User does not have owner perm');
            return res.status(403).send('Insufficient permissions (Owner)');
        }

        return next();
    }

    isUserSharingOrRemovingThemselves = (currentUserEmail: string, sharedUserEmail: string) => {
        return currentUserEmail === sharedUserEmail;
    }

    hasViewingPermissions = (dbDoc: any, uid: string, email: string) => {
        return dbDoc.owner.uid === uid || dbDoc.sharedWith.includes(email);
    }
}

function toS3Key(uuid: string) : string {
    return `${uuid}.pdf`
}

export { DocumentController };
