import {Router} from 'express';
import { DocumentController } from '../../controller/DocumentController';

const router = Router();

const documentController = new DocumentController();

// Get document by uuid
router.get('/:uuid', documentController.getDocument);

// Get document pdf and info by uuid
router.get('/:uuid/allData', documentController.getDocumentPDFandInfo);

// Delete document by uuid
router.delete('/:uuid/delete', documentController.deleteDocument);

// Update document by uuid
router.post('/:uuid/update', documentController.updateDocument);

// Share document
router.post('/:uuid/share', documentController.validateShareRequest, documentController.shareDocument);

// Remove user from document
router.post('/:uuid/removeUser', documentController.validateShareRequest, documentController.removeUserFromDocument);

// Create and upload document
router.post('/create', documentController.createAndUploadDocument);



export default router;