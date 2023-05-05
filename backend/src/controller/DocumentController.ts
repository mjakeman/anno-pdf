import { Request, Response } from 'express';
import Busboy from 'busboy';
import { createDocument, deleteDocument, updateDocument } from "../data/documents/documents-dao";
import s3 from "../s3/s3Config";
import Config from "../util/Config";
import { v4 as uuidv4 } from 'uuid';

class DocumentController {

    async deleteDocument(req: Request, res: Response) {
        // TODO: delete from S3
        const dbDoc = await deleteDocument(req.params.uuid);

        if (dbDoc) {
            return res.status(200).send('Document deleted from mongo - Title: ' + dbDoc.title);
        }

        return res.status(404).send('Document not found');
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

        const busboy = Busboy({ headers: req.headers});

        busboy.on('file', async (_fieldname: any, file: any, info: any)=> {
            if (info.mimeType !== 'application/pdf') {
                return res.status(400).send("Invalid file type, only pdf files are supported.");
            }

            const id = uuidv4();
            const params = {
                Bucket: Config.AWS_BUCKET,
                Key: `${id}.pdf`,
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
                url: upload.Location
            });

            if (dbDoc) {
                console.log('Document created in MongoDB - Title: ' + dbDoc.title);
                return res.status(201).json(dbDoc);
            }

            return res.sendStatus(422);
        })

        return req.pipe(busboy);
    }

}

export { DocumentController };
