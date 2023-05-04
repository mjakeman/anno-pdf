import {Router} from 'express';
import { DocumentController } from '../../controller/DocumentController';

const router = Router();

const documentController = new DocumentController();



// Delete document by uuid
router.delete('/:uuid/delete', documentController.deleteDocument);

// Update document by uuid
router.post('/:uuid/update', documentController.updateDocument);

// Create and upload document (in use)
router.post('/create', documentController.createAndUploadDocument);


// Create new document (unused)
router.post('/', documentController.createDocument);

// Upload document (unused)
router.post('/upload', documentController.uploadDocument);

export default router;