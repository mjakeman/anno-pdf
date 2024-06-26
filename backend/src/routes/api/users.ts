import {Router} from 'express';
import { UserController } from '../../controller/UserController';

const router = Router();

const userController = new UserController();

// Create new user in database (if they don't already exist)
router.post('/', userController.createUser);

// Delete user (only called by frontend automated test framework)
router.delete('/', userController.deleteUser);

// Get all users
router.get('/', userController.getUsers);

// Get all documents for user
router.get('/documents', userController.getDocuments);

// Get user by uid
router.get('/:uid', userController.getUser);

export default router;