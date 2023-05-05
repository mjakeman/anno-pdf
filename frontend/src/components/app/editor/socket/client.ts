import socketio, {Socket} from "socket.io-client";
import {v4 as uuidv4} from "uuid";
import {fabric} from "fabric";

const server = import.meta.env.VITE_BACKEND_URL;

type PageCallback = {
    objectAddedFunc: (uuid: string, data: fabric.Object) => void;
    objectModifiedFunc: (uuid: string, data: fabric.Object) => void;
}

export default class SocketClient {

    socket: Socket | null = null;
    map: Map<number, PageCallback> = new Map<number, PageCallback>();

    setup = () => {
        this.socket = socketio(server);

        const username = uuidv4();
        this.socket.emit("set-username", username);

        this.socket.on('peer-added', this.peerObjectAdded);
        this.socket.on('peer-modified', this.peerObjectModified);
    }

    teardown = () => {
        this.socket?.disconnect();
    }

    registerPage = (index: number, callback: PageCallback) => {
        this.map.set(index, callback);
    }

    unregisterPage = (index: number) => {
        this.map.delete(index);
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