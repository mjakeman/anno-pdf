import {fabric} from "fabric";

/**
 * Similar to AnnoUser but specifically for sharing with
 * users (i.e. invitations).
 */
export interface SharedUser {
    uid: string | null; // Null if the user doesn't exist yet (i.e. sharing with someone who doesn't have an Anno account)
    name: string | null; // Null if the user doesn't exist yet
    email: string;
}

/**
 * Standard format of a User throughout the application
 *
 * IMPORTANT: Match controller.ts in backend
 */
export interface AnnoUser {
    uid: string;
    name: string;
    email: string;
}

/**
 * Document object containing core metadata and a reference to
 * the pages themselves (in the form of fabric canvases).
 */
export interface AnnoDocument {
    uuid: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    base64File: string,
    sharedWith: SharedUser[] // Array of Users
    owner: AnnoUser,
    pages: fabric.Canvas[]
}