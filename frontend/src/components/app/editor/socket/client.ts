import socketio, {Socket} from "socket.io-client";
import {v4 as uuidv4} from "uuid";
import {fabric} from "fabric";

const server = "http://localhost:8080";

export default class SocketClient {

    socket: Socket|null = null;

    setup() {
        this.socket = socketio(server);

        const username = uuidv4();
        this.socket!.emit("set-username", username);
    }

    teardown() {
        this.socket?.disconnect();
    }

    onObjectModified(index: number, data: fabric.IEvent) {
        console.log("modified: " + data);
        // this.socket!.emit("object-modified", data);
    }

    onObjectRotating(index: number, data: fabric.IEvent) {
        console.log("rotated: " + data);
        // this.socket!.emit("object-modified", data);
    }

    onObjectScaling(index: number, data: fabric.IEvent) {
        console.log("scaled: " + data);
        // this.socket!.emit("object-modified", data);
    }

    onObjectMoving(index: number, data: fabric.IEvent) {
        console.log("moving: " + data);
        // this.socket!.emit("object-modified", data);
    }

    onObjectSkewing(index: number, data: fabric.IEvent) {
        console.log("skewing: " + data);
        // this.socket!.emit("object-modified", data);
    }

};