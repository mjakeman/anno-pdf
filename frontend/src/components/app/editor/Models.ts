import {fabric} from "fabric";

export interface SharedUser {
    uid: string | null; // Null if the user doesn't exist yet (i.e. sharing with someone who doesn't have an Anno account)
    name: string | null; // Null if the user doesn't exist yet
    email: string;
}

// IMPORTANT: Match controller.ts in backend
export interface AnnoUser {
    uid: string;
    name: string;
    email: string;
}

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