import {Router} from 'express';
import { UserController } from '../../controller/UserController';

const router = Router();

const userController = new UserController();

// Get all users
router.get('/', userController.getUsers);

// Get user by uuid
router.get('/:uuid', userController.getUser);

// Get all documents for user
router.get('/:uuid/documents', userController.getDocuments);

// Create new user in database (if they don't already exist)
router.post('/auth', userController.createUser);

export default router;