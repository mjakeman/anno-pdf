import { Request, Response } from 'express';
import { createDocument, deleteDocument } from "../data/documents/documents-dao";

class DocumentController {
    async getDocuments(_req: Request, res: Response) {
        res.send("Not implemented");
    }

    async createDocument(req: Request, res: Response) {
        const dbDoc = await createDocument(req.body);

        if (dbDoc) {
            console.log('Document created - Title: ' + dbDoc.title);
            return res.status(201).json(dbDoc);
        }

        return res.sendStatus(422);
    }

    async deleteDocument (req: Request, res: Response) {
        const dbDoc = await deleteDocument(req.params.id);

        if (dbDoc) {
            return res.status(200).send('Document deleted - id: ' + dbDoc._id);
        }

        return res.status(404).send('Document not found');
    }

}

export { DocumentController };
