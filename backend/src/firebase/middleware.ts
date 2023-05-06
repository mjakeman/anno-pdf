import admin from './firebaseAdminConfig';
import { Request, Response, NextFunction } from 'express'
import Config from "../util/Config";
import {DecodedIdToken} from "firebase-admin/lib/auth";

class Middleware {

    async decodeToken(authHeader: string|undefined): Promise<DecodedIdToken|null> {

        if (!authHeader) {
            console.error("Auth header not found");
            return null;
        }

        const token = authHeader.split(' ')[1];

        try {
            const decodedToken = await admin.auth().verifyIdToken(token);

            if (decodedToken) {
                return decodedToken;
            }
        } catch (e) {
            console.log(e.message);
        }

        return null;
    }

    // Authentication middleware
    async validateToken(req: Request, res: Response, next: NextFunction) {
        if (Config.ENVIRONMENT !== 'PROD') {
            req.user = Config.TEST_UID;
            return next();
        }

        // Bearer token
        let token = await this.decodeToken(req.headers.authorization);

        // Pass to REST handlers
        if (token) {
            req.user = token.uid;
            return next();
        }

        // Auth failed -> deny
        return res.status(401).send('Unauthorized user');
    }

}

export default new Middleware();