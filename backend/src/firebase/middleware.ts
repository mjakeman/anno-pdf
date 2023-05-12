import admin from './firebaseAdminConfig';
import { Request, Response, NextFunction } from 'express'
import {DecodedIdToken} from "firebase-admin/lib/auth";

// Middleware helper function to verify a token using firebase admin
const decodeToken = async (authHeader: string|undefined): Promise<DecodedIdToken|null> => {
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

/**
 * Authentication middleware.
 * Decodes the auth token and appends user details to requests if successful, as well as passing control to the controller methods.
 */
let validateToken = async (req: Request, res: Response, next: NextFunction) => {
    // Bearer token
    let token = await decodeToken(req.headers.authorization);

    // Pass to REST handlers
    if (token) {
        if (!token.email) {
            return res.status(401).send('email not found in auth token');
        }

        if (!token.uid) {
            return res.status(401).send('uid not found in auth token');
        }

        req.user = {
            uid: token.uid,
            email: token.email
        }

        return next();
    }

    // Auth failed -> deny
    return res.status(401).send('Unauthorized user');
}

export { validateToken };