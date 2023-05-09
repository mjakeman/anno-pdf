import socketio, {Socket} from "socket.io-client";
import {fabric} from "fabric";
import {useContext} from "react";
import {DocumentContext, UserData} from "../Editor";

const server = import.meta.env.VITE_BACKEND_URL;

type PageCallback = {
    objectAddedFunc: (uuid: string, data: fabric.Object) => void;
    objectModifiedFunc: (uuid: string, data: fabric.Object) => void;
}

export default class SocketClient {

    socket: Socket | null = null;
    map: Map<number, PageCallback> = new Map<number, PageCallback>();
    context = useContext(DocumentContext);
    notify?: Function;

    setup = (userId: string, documentId: string, notify?: Function) => {
        this.socket = socketio(server);
        this.notify = notify;

        this.socket.on('peer-added', this.peerObjectAdded);
        this.socket.on('peer-modified', this.peerObjectModified);
        this.socket.on('peer-connected', this.peerConnected);
        this.socket.on('peer-disconnected', this.peerDisconnected);

        this.socket.on('connect', () => this.sendInitialData(userId, documentId));
        this.socket.on('reconnect', () => this.sendInitialData(userId, documentId));
        this.socket.on('error', (message) => {
            notify?.call(null, message);
        });
    }

    teardown = () => {
        this.socket?.disconnect();
    }

    sendInitialData = (userId: string, documentId: string) => {
        if (!userId || !documentId) {
            this.notify?.call(null, "Either userId (" + userId + ") or documentId (" + documentId + ") is not valid");
            return;
        }

        this.socket?.emit('initial-data', userId, documentId);
    }

    registerPage = (index: number, callback: PageCallback) => {
        this.map.set(index, callback);
    }

    unregisterPage = (index: number) => {
        this.map.delete(index);
    }

    peerConnected = (userData: UserData) => {
        const [_active, addActiveUser] = this.context;

        console.log("Peer connected: " + JSON.stringify(userData));

        if (!userData.id) {
            console.error("ERROR: User ID is null");
            this.notify?.call(null, "User ID is null");
            return;
        }

        if (!userData.name) {
            console.error("ERROR: User name is null");
            this.notify?.call(null, "User name is null");
            userData.name = "Unknown User";
        }

        if (!userData.email) {
            console.error("ERROR: User email is null");
            this.notify?.call(null, "User email is null");
            userData.email = "Unknown Email";
        }

        addActiveUser(userData);
    }

    peerDisconnected = (userId: string) => {

        console.log("Peer disconnected: " + JSON.stringify(userId));

        const [_active, _add, removeActiveUser] = this.context;
        removeActiveUser(userId);
    }

    peerObjectAdded = (index: number, uuid: string, data: fabric.Object) => {
        console.log("Received page " + index + " addition from peer: " + data);
        const callbacks = this.map.get(index);
        callbacks?.objectAddedFunc(uuid, data);
    }

    peerObjectModified = (index: number, uuid: string, data: fabric.Object) => {
        console.log("Received page " + index + " modification from peer: " + data);
        const callbacks = this.map.get(index);
        callbacks?.objectModifiedFunc(uuid, data);
    }

    onObjectModified = (index: number, data: fabric.IEvent) => {
        console.log("modified: " + data);
        if (!this.socket) {
            console.error("Socket is null");
            return;
        }
        // @ts-ignore
        const uuid = data.target!.get('id');
        this.socket.emit("object-modified", index, uuid, data.target!.toJSON());
    }

    onObjectAdded = (index: number, uuid: string, object: fabric.Object) => {
        if (!this.socket) {
            console.error("Socket is null");
            return;
        }
        this.socket.emit("object-added", index, uuid, object.toJSON());
    }

};