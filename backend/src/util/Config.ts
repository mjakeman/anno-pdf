import dotenv from 'dotenv';

dotenv.config();

declare var process : {
    env: {
        MONGODB_URI: string
        PORT: number
        ENVIRONMENT: string
    }
  }

const MONGODB_URI = process.env.MONGODB_URI;

/*
 * The default port of the application
 */
const PORT = process.env.PORT || 9002;

const ENVIRONMENT = process.env.ENVIRONMENT || 'PROD';

export default {
    PORT,
    MONGODB_URI,
    ENVIRONMENT
};