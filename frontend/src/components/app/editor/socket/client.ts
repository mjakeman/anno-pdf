import socketio, {Socket} from "socket.io-client";
import {fabric} from "fabric";

const server = import.meta.env.VITE_BACKEND_URL;

type PageCallback = {
    objectAddedFunc: (uuid: string, data: fabric.Object) => void;
    objectModifiedFunc: (uuid: string, data: fabric.Object) => void;
}

// Match controller.ts in backend
interface UserData {
    id: string,
    fullName: string,
    email: string,
}

export default class SocketClient {

    socket: Socket | null = null;
    map: Map<number, PageCallback> = new Map<number, PageCallback>();
    peers: Array<UserData> = new Array<UserData>();

    setup = (userId: string, documentId: string) => {
        this.socket = socketio(server);

        this.socket.on('peer-added', this.peerObjectAdded);
        this.socket.on('peer-modified', this.peerObjectModified);
        this.socket.on('peer-connected', this.peerConnected);
        this.socket.on('peer-disconnected', this.peerDisconnected);

        this.socket.on('connect', () => this.sendInitialData(userId, documentId));
        this.socket.on('reconnect', () => this.sendInitialData(userId, documentId));
        this.socket.on('disconnect', () => alert("Backend server terminated the connection"));
    }

    teardown = () => {
        this.socket?.disconnect();
    }

    sendInitialData = (userId: string, documentId: string) => {
        this.peers = [];
        this.socket?.emit('initial-data', userId, documentId);
    }

    registerPage = (index: number, callback: PageCallback) => {
        this.map.set(index, callback);
    }

    unregisterPage = (index: number) => {
        this.map.delete(index);
    }

    peerConnected = (userData: UserData) => {
        this.peers.push(userData);
        console.log(this.peers);
    }

    peerDisconnected = (userId: string) => {
        const obj = this.peers.find(obj => obj.id == userId)!;
        const index = this.peers.indexOf(obj);
        delete this.peers[index];
        console.log(this.peers);
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