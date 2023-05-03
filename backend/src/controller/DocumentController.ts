import { Request, Response } from 'express';
import Busboy from 'busboy';
import { createDocument, deleteDocument, updateDocument } from "../data/documents/documents-dao";
import s3 from "../s3/s3Config";
import Config from "../util/Config";

class DocumentController {

    async createDocument(req: Request, res: Response) {
        const dbDoc = await createDocument(req.body);

        if (dbDoc) {
            console.log('Document created - Title: ' + dbDoc.title);
            return res.status(201).json(dbDoc);
        }

        return res.sendStatus(422);
    }

    async deleteDocument(req: Request, res: Response) {
        const dbDoc = await deleteDocument(req.params.id);

        if (dbDoc) {
            return res.status(200).send('Document deleted - Title: ' + dbDoc.title);
        }

        return res.status(404).send('Document not found');
    }

    async updateDocument(req: Request, res: Response) {
        const updatedDoc = await updateDocument(req.params.id, req.body);

        if (updatedDoc) {
            return res.status(200).json(updatedDoc);
        }

        return res.status(404).send('Document not found');
    }

    async uploadDocument(req: Request, res: Response) {
        const busboy = Busboy({ headers: req.headers});

        busboy.on('file', async (_fieldname: any, file: any, info: any)=> {
            const params = {
                Bucket: Config.AWS_BUCKET,
                Key: info.filename,
                Body: file
            };

            const upload = await s3.upload(params).promise();
            console.log('The upload: ', upload);

            res.json({ message: 'Upload Complete' });
        })

        return req.pipe(busboy);
    }

}

export { DocumentController };
