import admin from './firebaseAdminConfig';
import { Request, Response, NextFunction } from 'express'
import Config from "../util/Config";

class Middleware {

    // Authentication middleware
    async decodeToken(req: Request, res: Response, next: NextFunction) {
        if (Config.ENVIRONMENT !== 'PROD') {
            req.user = Config.TEST_UID;
            return next();
        }

        // Bearer token
        let token: string;
        if (req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        } else {
            return res.status(400).send('Auth header not found');
        }

        try {
            const decodedToken = await admin.auth().verifyIdToken(token);

            if (decodedToken) {
                req.user = decodedToken.uid;
                return next();
            }
        } catch (e) {
            console.log(e.message);
        }

        return res.status(401).send('Unauthorized user');
    }

}

export default new Middleware();