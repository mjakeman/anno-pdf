import {fabric} from "fabric";

export interface SharedUser {
    uuid: string | null; // Null if the user doesn't exist yet (i.e. sharing with someone who doesn't have an Anno account)
    name: string | null; // Null if the user doesn't exist yet
    email: string;
}

export interface Owner {
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
    owner: Owner
    annotations: fabric.Canvas[]
}