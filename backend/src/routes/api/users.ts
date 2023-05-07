import {Router} from 'express';
import { UserController } from '../../controller/UserController';

const router = Router();

const userController = new UserController();

// Create new user in database (if they don't already exist)
router.post('/', userController.createUser);

// Get all users
router.get('/', userController.getUsers);

// Get all documents for user
router.get('/documents', userController.getDocuments);

// Get user by uid
router.get('/:uid', userController.getUser);

router.post('/invite', userController.sendEmail);
export default router;