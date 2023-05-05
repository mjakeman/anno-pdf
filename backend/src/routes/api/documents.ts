import {Router} from 'express';
import { DocumentController } from '../../controller/DocumentController';

const router = Router();

const documentController = new DocumentController();

// Get document by uuid
router.get('/:uuid', documentController.getDocument);

// Delete document by uuid
router.delete('/:uuid/delete', documentController.deleteDocument);

// Update document by uuid
router.post('/:uuid/update', documentController.updateDocument);

// Create and upload document
router.post('/create', documentController.createAndUploadDocument);


export default router;