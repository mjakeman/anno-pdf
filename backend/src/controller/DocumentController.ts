import {NextFunction, Request, Response} from 'express';
import Busboy from 'busboy';
import { createDocument, deleteDocument, updateDocument, getDocument, addSharedUser, removeSharedUser } from "../data/documents/documents-dao";
import s3 from "../s3/s3Config";
import Config from "../util/Config";
import { v4 as uuidv4 } from 'uuid';
import {EmailService} from "../service/EmailService";

const emailService = new EmailService();

class DocumentController {

    async deleteDocument(req: Request, res: Response) {
        const dbDoc = await deleteDocument(req.params.uuid);
        if (!dbDoc) {
            return res.status(404).send('Document not found');
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

    async getDocument(req: Request, res: Response) {
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
            return res.set("Content-Type", "application/pdf").send(s3Document.Body);
        } catch (e) {
            console.log(e.message);
            return res.status(500).send("Error fetching document from s3");
        }
    }

    async updateDocument(req: Request, res: Response) {
        let user: string;
        if (req.user) {
            user = req.user;
        } else {
            return res.status(400).send('User not found in request object.');
        }

        const data = req.body;
        data['lastUpdatedBy'] = user;
        const updatedDoc = await updateDocument(req.params.uuid, data);

        if (updatedDoc) {
            return res.status(200).json(updatedDoc);
        }

        return res.status(404).send('Document not found');
    }

    async createAndUploadDocument(req: Request, res: Response) {
        let user: string;
        if (req.user) {
            user = req.user;
        } else {
            return res.status(400).send('User not found in request object.');
        }

        let busboy;
        try {
            busboy = Busboy({ headers: req.headers});
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
                createdBy: user,
                title: info.filename,
                uuid: id,
                sharedWith: [],
                annotations: {},
                url: upload.Location,
            });

            if (dbDoc) {
                console.log('Document created in MongoDB - Title: ' + dbDoc.title);
                return res.status(201).json(dbDoc);
            }

            return res.sendStatus(422);
        })

        return req.pipe(busboy);
    }

    async shareDocument(req: Request, res: Response) {
        const updatedDoc = await addSharedUser(req.params.uuid, req.body.email);

        // send invite email
        const emailSent = await emailService.sendEmail(req.params.uuid, req.body.email)
        if (emailSent) {
            console.log(`Document shared: email sent to ${req.body.email}`);
        } else {
            console.log(`Error sending invite email to ${req.body.email}`);
        }

        return res.json(updatedDoc);
    }

    async removeUserFromDocument(req: Request, res: Response) {
        const updatedDoc = await removeSharedUser(req.params.uuid, req.body.email);
        return res.json(updatedDoc);
    }

    async validateShareRequest(req: Request, res: Response, next: NextFunction) {
        const dbDoc = await getDocument(req.params.uuid);
        if (!dbDoc) {
            return res.status(404).send('Document not found');
        }

        let user: string;
        if (req.user) {
            user = req.user;
        } else {
            return res.status(500).send('User not found in request object. Internal server error');
        }

        if (dbDoc.createdBy !== user) {
            return res.status(403).send('Only document owners have sharing permissions');
        }

        if (!req.body.email) {
            return res.status(400).send('"email" field is required in the request body');
        }

        return next();
    }

}

function toS3Key(uuid: string) : string {
    return `${uuid}.pdf`
}

export { DocumentController };
