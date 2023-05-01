import admin from './firebaseAdminConfig';
import { Request, Response, NextFunction } from 'express'

class Middleware {
    async decodeToken(req: Request, res: Response, next: NextFunction) {
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
                return next();
            }
        } catch (e) {
            console.log(e.message);
        }

        return res.status(401).send('Unauthorized user');
    }

}

export default new Middleware();