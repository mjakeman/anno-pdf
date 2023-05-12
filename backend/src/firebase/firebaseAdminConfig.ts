import admin from 'firebase-admin';
import Config from "../util/Config";

/**
 * Initialize the firebase admin from the Config env variables
 *
 * Thanks: https://stackoverflow.com/a/61844642
 */
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(Buffer.from(Config.FIREBASE_CONFIG_BASE64, 'base64').toString('ascii')))
});

export default admin;