declare namespace Express {
    // Allows us to append a user to http requests
    export interface Request {
        user? : {
            uid: string,
            email: string,
        }
    }
}