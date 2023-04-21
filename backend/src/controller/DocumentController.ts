import { Request, Response } from 'express';
import { getDocuments, createDocument } from "../data/documents/documents-dao";

class DocumentController {
    async getDocuments(_req: Request, res: Response) {
        res.send(await getDocuments());
    }

    async createDocument(req: Request, res: Response) {
        const dbDoc = await createDocument(req.body);

        if (dbDoc) {
            console.log('Document created - Title: ' + dbDoc.title);
            return res.status(201).json(dbDoc);
        }

        return res.sendStatus(422);
    }

}

export { DocumentController };
