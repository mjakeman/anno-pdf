import { Router } from 'express';
import userRouter from '../routes/api/users'
import documentRouter from '../routes/api/documents'
import middleware from "../firebase/middleware";

/*
 * Main routing file to manage all application routes.
 */
const router = Router();

router.use(['/users', '/user'], middleware.validateToken, userRouter);
router.use('/documents', middleware.validateToken, documentRouter);

export default router;