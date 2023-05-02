import socketio, {Socket} from "socket.io-client";
import {v4 as uuidv4} from "uuid";
import {fabric} from "fabric";

const server = "http://localhost:8080";

type PageCallback = {
    objectAddedFunc: (data: fabric.IEvent) => void;
    objectModifiedFunc: (data: fabric.IEvent) => void;
}

export default class SocketClient {

    socket: Socket | null = null;
    map: Map<number, PageCallback> = new Map<number, PageCallback>();

    setup = () => {
        this.socket = socketio(server);

        const username = uuidv4();
        this.socket!.emit("set-username", username);

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

    peerObjectAdded = (index: number, data: fabric.IEvent) => {
        console.log("Received page " + index + " modification from peer: " + data);
        const callbacks = this.map.get(index);
        callbacks?.objectAddedFunc(data);
    }

    peerObjectModified = (index: number, data: fabric.IEvent) => {
        console.log("Received page " + index + " modification from peer: " + data);
        const callbacks = this.map.get(index);
        callbacks?.objectModifiedFunc(data);
    }

    onObjectModified = (index: number, data: fabric.IEvent) => {
        console.log("modified: " + data);
        if (!this.socket) {
            console.error("Socket is null");
            return;
        }
        this.socket.emit("object-modified", index, data);
    }

    onObjectAdded = (index: number, data: fabric.IEvent) => {
        console.log("added: " + data);
        if (!this.socket) {
            console.error("Socket is null");
            return;
        }
        this.socket.emit("object-added", index, data);
    }

};