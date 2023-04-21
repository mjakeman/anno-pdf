import {Router} from 'express';
import { UserController } from '../../controller/UserController';

const router = Router();

const userController = new UserController();

// Get all users
router.get('/', userController.getUsers);

// Create new user
router.post('/', userController.createUser);

export default router;