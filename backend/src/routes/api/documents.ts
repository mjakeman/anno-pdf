import {Router} from 'express';
import { DocumentController } from '../../controller/DocumentController';

const router = Router();

const documentController = new DocumentController();

// Get document by uuid
router.get('/:uuid', documentController.checkDocumentViewingPermissions, documentController.getDocument);

// Delete document by uuid
router.delete('/:uuid/delete', documentController.checkDocumentOwnerPermissions, documentController.deleteDocument);

// Update document by uuid
router.post('/:uuid/update', documentController.checkDocumentViewingPermissions, documentController.updateDocument);

// Copy document by uuid
router.post('/:uuid/copy', documentController.checkDocumentViewingPermissions, documentController.copyDocument);

// Share document
router.post('/:uuid/share', documentController.checkDocumentViewingPermissions, documentController.shareDocument);

// Remove user from document
router.post('/:uuid/removeUser', documentController.checkDocumentOwnerPermissions, documentController.removeUserFromDocument);

// Create and upload document
router.post('/create', documentController.createAndUploadDocument);



export default router;