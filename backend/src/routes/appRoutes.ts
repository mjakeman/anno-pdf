import { Router } from 'express';
import userRouter from '../routes/api/users'
import documentRouter from '../routes/api/documents'
import middleware from "../firebase/middleware";

/*
 * Main routing file to manage all application routes.
 */
const router = Router();

router.use(['/users', '/user'], middleware.decodeToken, userRouter);
router.use('/documents', middleware.decodeToken, documentRouter);

export default router;