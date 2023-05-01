import { Router } from 'express';
import userRouter from '../routes/api/users'
import documentRouter from '../routes/api/documents'
import middleware from "../firebase/middleware";
import Config from "../util/Config";

/*
 * Main routing file to manage all application routes.
 */
const router = Router();

// Authentication middleware
if (Config.ENVIRONMENT === 'PROD') {
    router.use('/', middleware.decodeToken);
}

router.use(['/users', '/user'], userRouter);
router.use('/documents', documentRouter);

export default router;