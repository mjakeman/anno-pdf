import { Router } from 'express';
import userRouter from '../routes/api/users'
import documentRouter from '../routes/api/documents'
import {validateToken} from "../firebase/middleware";

/*
 * Main routing file to manage all application routes.
 */
const router = Router();

router.use(['/users', '/user'], validateToken, userRouter);
router.use('/documents', validateToken, documentRouter);

export default router;