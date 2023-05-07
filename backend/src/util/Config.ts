import dotenv from 'dotenv';

dotenv.config();

declare var process : {
    env: {
        MONGODB_URI: string
        PORT: number
        ENVIRONMENT: string
        AWS_ACCESS_KEY: string
        AWS_SECRET_ACCESS_KEY: string
        AWS_BUCKET: string
        TEST_UID: string
        FIREBASE_CONFIG_BASE64: string
        GMAIL: string
        GMAIL_PASSWORD: string
        FRONTEND_BASE_URL: string
    }
  }

const MONGODB_URI = process.env.MONGODB_URI;
const FIREBASE_CONFIG_BASE64 = process.env.FIREBASE_CONFIG_BASE64;
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_BUCKET = process.env.AWS_BUCKET;
const TEST_UID = process.env.TEST_UID || "DEFAULT UID";
const GMAIL = process.env.GMAIL;
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;


/*
 * The default port of the application
 */
const PORT = process.env.PORT || 9002;

const ENVIRONMENT = process.env.ENVIRONMENT || 'PROD';

export default {
    PORT,
    MONGODB_URI,
    FIREBASE_CONFIG_BASE64,
    ENVIRONMENT,
    AWS_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET,
    TEST_UID,
    GMAIL,
    GMAIL_PASSWORD,
    FRONTEND_BASE_URL
};