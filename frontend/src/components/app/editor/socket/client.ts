import socketio, {Socket} from "socket.io-client";
import {fabric} from "fabric";
import {useContext} from "react";
import {DocumentContext} from "../Editor";
import {AnnoUser} from "../Models";

const server = import.meta.env.VITE_BACKEND_URL;

type PageCallback = {
    objectAddedFunc: (data: fabric.Object) => void;
    objectModifiedFunc: (data: fabric.Object) => void;
    objectRemovedFunc: (uuid: string) => void;
}

export default class SocketClient {

    socket: Socket | null = null;
    map: Map<number, PageCallback> = new Map<number, PageCallback>();
    backfillQueue = new Map<number, Array<fabric.Object>>();
    context = useContext(DocumentContext);
    notify?: Function;

    setup = (userId: string, documentId: string, notify?: Function) => {
        this.socket = socketio(server);
        this.notify = notify;

        this.socket.on('peer-added', this.peerObjectAdded);
        this.socket.on('peer-modified', this.peerObjectModified);
        this.socket.on('peer-removed', this.peerObjectRemoved);
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

        const [_active, _add, _remove, _shared, resetActiveUsers] = this.context;
        resetActiveUsers();

        this.socket?.emit('initial-data', userId, documentId);
    }

    registerPage = (index: number, callback: PageCallback) => {
        this.map.set(index, callback);
        this.doBackfill(index);
    }

    unregisterPage = (index: number) => {
        this.map.delete(index);
    }

    peerConnected = (userData: AnnoUser) => {
        const [_active, addActiveUser] = this.context;

        console.log("Peer connected: " + JSON.stringify(userData));

        if (!userData.uid) {
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

    pushBackfill = (index: number, data: fabric.Object) => {
        let queue = this.backfillQueue.get(index);
        if (!queue) {
            queue = [];
            this.backfillQueue.set(index, queue);
        }

        queue.push(data);
    }

    doBackfill = (index: number) => {
        const queue = this.backfillQueue.get(index);
        if (queue) {
            while (queue.length != 0) {
                const item = queue.pop();
                if (item) {
                    const callbacks = this.map.get(index);
                    callbacks?.objectAddedFunc(item);
                }
            }
        }
    }

    safeConvertToPayload = (object: fabric.Object) => {
        // This works. Don't touch it please
        return object.toObject(["uuid", "latex"]);
    }

    peerObjectAdded = (index: number, data: Object) => {
        console.log("Received page " + index + " addition from peer");
        const parsed = data as fabric.Object;
        const callbacks = this.map.get(index);
        if (callbacks)
            callbacks?.objectAddedFunc(parsed);
        else
            this.pushBackfill(index, parsed);
    }

    peerObjectModified = (index: number, data: Object) => {
        console.log("Received page " + index + " modification from peer");
        const parsed = data as fabric.Object;
        const callbacks = this.map.get(index);
        callbacks?.objectModifiedFunc(parsed);
    }

    peerObjectRemoved = (index: number, uuid: string) => {
        console.log("Received page " + index + " removal from peer");
        const callbacks = this.map.get(index);
        callbacks?.objectRemovedFunc(uuid);
    }

    onObjectModified = (index: number, data: fabric.IEvent) => {
        console.log("modified: " + JSON.stringify(data));
        if (!this.socket) {
            console.error("Socket is null");
            return;
        }

        // Check for event type
        if (data.target instanceof fabric.ActiveSelection) {

            const selection = data.target!;

            let socket = this.socket;

            const objects = selection.getObjects();

            // Iterate over objects in selection, temporarily remove them
            // to have normalised object coordinates, transmit the update, then
            // re-add them to the selection. Brilliant API design. I love fabric <3
            for (const obj of objects) {

                try {
                    if ((obj as any).transient) {
                        console.info("Transient object, skipping...")
                        return obj;
                    }
                } catch (e) {}

                selection.removeWithUpdate(obj);

                // Convert payload inside removeWithUpdate block
                try {
                    const json = this.safeConvertToPayload(obj)
                    socket.emit("object-modified", index, json);
                    console.log(`MODIFIED: ${obj.type} ${(obj as any).uuid}`);
                } catch (e) {
                    console.error(e);
                }

                selection.addWithUpdate(obj);
            }

        } else if (data.target instanceof fabric.Object) {

            const obj = data.target!;

            try {
                if ((obj as any).transient) {
                    console.info("Transient object, skipping...")
                    return obj;
                }
            } catch (e) {}

            const json = this.safeConvertToPayload(obj);
            this.socket.emit("object-modified", index, json);
            console.log(`ADDED: ${obj.type} ${(obj as any).uuid}`);
        } else {
            console.error("other! unprocessable");
            console.error(data.target!);
            return;
        }
    }

    onObjectAdded = (index: number, object: fabric.Object) => {

        if (object instanceof fabric.Group) {
            console.info("Skipping group");
            return;
        }

        try {
            if ((object as any).transient) {
                console.info("Transient object, skipping...")
                return object;
            }
        } catch (e) {}

        if (!this.socket) {
            console.error("Socket is null");
            return;
        }

        console.log(`ADDED: ${object.type} ${(object as any).uuid}`);

        if (object.type === 'MathItext') {
            console.info("Sending maths annotation");
        }

        const json = this.safeConvertToPayload(object);

        // console.log(`Sending: ${json}`);

        this.socket.emit("object-added", index, json);
    }

    onObjectRemoved = (index: number, object: fabric.Object) => {

        if (!this.socket) {
            console.error("Socket is null");
            return;
        }

        console.log(`REMOVED: ${object.type} ${(object as any).uuid}`);

        const uuid = (object as any).uuid;

        this.socket.emit("object-removed", index, uuid);
    }

};