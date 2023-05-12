import {initializeApp,} from "firebase/app";
import {getAuth} from "firebase/auth";

const app = initializeApp({
    apiKey: import.meta.env.VITE_FB_AUTH_API_KEY,
    authDomain: import.meta.env.VITE_FB_AUTH_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FB_AUTH_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FB_AUTH_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FB_AUTH_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FB_AUTH_APP_ID,
});

const auth = getAuth(app);

export { auth }