import {Router} from 'express';
import { DocumentController } from '../../controller/DocumentController';

const router = Router();

const documentController = new DocumentController();

// Get all documents
router.get('/', documentController.getDocuments);

// Create new document
router.post('/', documentController.createDocument);

// Delete document by id
router.delete('/:id/delete', documentController.deleteDocument);

// Update document by id
router.post('/:id/update', documentController.updateDocument)

export default router;