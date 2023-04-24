import { Router } from 'express';
import userRouter from '../routes/api/users'
import documentRouter from '../routes/api/documents'

/*
 * Main routing file to manage all application routes.
 */
const router = Router();

router.use(['/users', '/user'], userRouter);
router.use('/documents', documentRouter);

export default router;