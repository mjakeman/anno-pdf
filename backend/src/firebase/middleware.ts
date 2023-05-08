import admin from './firebaseAdminConfig';
import { Request, Response, NextFunction } from 'express'
import {DecodedIdToken} from "firebase-admin/lib/auth";

class Middleware {

    decodeToken = async (authHeader: string|undefined): Promise<DecodedIdToken|null> => {

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
    validateToken = async (req: Request, res: Response, next: NextFunction) => {
        // Bearer token
        let token = await this.decodeToken(req.headers.authorization);

        // Pass to REST handlers
        if (token) {
            req.uid = token.uid;
            req.email = token.email;
            return next();
        }

        // Auth failed -> deny
        return res.status(401).send('Unauthorized user');
    }

}

export default new Middleware();