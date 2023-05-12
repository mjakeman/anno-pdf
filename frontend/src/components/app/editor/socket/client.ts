import socketio, {Socket} from "socket.io-client";
import {fabric} from "fabric";
import {useContext} from "react";
import {DocumentContext} from "../Editor";
import {AnnoUser} from "../Models";

/**
 * URL of socket.io server (equivalent to backend, for now)
 */
const server = import.meta.env.VITE_BACKEND_URL;

/**
 * Required callbacks to handle incoming events from other
 * peers through the backend.
 *
 * The consumer should provide the socket client with an instance
 * of this type.
 */
type PageCallback = {
    objectAddedFunc: (data: fabric.Object) => void;
    objectModifiedFunc: (data: fabric.Object) => void;
    objectRemovedFunc: (uuid: string) => void;
}

/**
 * The socket client is the gateway between clients and the
 * real time communication system. It sends out and receives
 * change events to and from the backend.
 */
export default class SocketClient {
    socket: Socket | null = null;
    map: Map<number, PageCallback> = new Map<number, PageCallback>();
    backfillQueue = new Map<number, Array<fabric.Object>>();
    context = useContext(DocumentContext);
    notify?: Function;

    /**
     * Entry point to the socket client. Perform a handshake with the server
     * and prepare to receive events.
     *
     * @param userId ID of currently logged-in user
     * @param documentId ID of active document
     * @param notify Callback to notify in case of error
     */
    setup = (userId: string, documentId: string, notify?: Function) => {
        this.socket = socketio(server);
        this.notify = notify;

        // Events from other clients (peers)
        this.socket.on('peer-added', this.peerObjectAdded);
        this.socket.on('peer-modified', this.peerObjectModified);
        this.socket.on('peer-removed', this.peerObjectRemoved);
        this.socket.on('peer-connected', this.peerConnected);
        this.socket.on('peer-disconnected', this.peerDisconnected);

        // Events pertaining to this client
        this.socket.on('connect', () => this.sendInitialData(userId, documentId));
        this.socket.on('reconnect', () => this.sendInitialData(userId, documentId));
        this.socket.on('error', (message) => {
            notify?.call(null, message);
        });
    }

    /**
     * Gracefully terminate the socket connection
     */
    teardown = () => {
        this.socket?.disconnect();
    }

    /**
     * This is the handshake itself. We send our initialisation data to the
     * server and identify ourselves. This allows the server to initialise any
     * relevant resources to the active document and start up an editing session.
     *
     * @param userId Current user id
     * @param documentId Current document id
     */
    sendInitialData = (userId: string, documentId: string) => {
        if (!userId || !documentId) {
            this.notify?.call(null, "Either userId (" + userId + ") or documentId (" + documentId + ") is not valid");
            return;
        }

        const [_active, _add, _remove, _shared, resetActiveUsers] = this.context;
        resetActiveUsers();

        this.socket?.emit('initial-data', userId, documentId);
    }

    /**
     * A PageRenderer will identify itself to the socket client
     * using this method.
     *
     * @param index Page number of the renderer
     * @param callback Group of callbacks associated with this page
     */
    registerPage = (index: number, callback: PageCallback) => {
        this.map.set(index, callback);
        this.doBackfill(index);
    }

    /**
     * Teardown counterpart of above.
     *
     * @param index Page number of renderer
     */
    unregisterPage = (index: number) => {
        this.map.delete(index);
    }

    /**
     * Peer has connected to the document. Add to active users.
     *
     * @param userData User data received from server (name, id, email)
     */
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

    /**
     * Teardown equivalent of above. Remove from active user bubbles.
     *
     * @param userId User id of leaving peer
     */
    peerDisconnected = (userId: string) => {

        console.log("Peer disconnected: " + JSON.stringify(userId));

        const [_active, _add, removeActiveUser] = this.context;
        removeActiveUser(userId);
    }

    /**
     * Store backfill annotations if the client is not ready yet. Process
     * them later once we're initialised
     *
     * @param index Page index
     * @param data Data to store
     */
    pushBackfill = (index: number, data: fabric.Object) => {
        let queue = this.backfillQueue.get(index);
        if (!queue) {
            queue = [];
            this.backfillQueue.set(index, queue);
        }

        queue.push(data);
    }

    /**
     * Clear the backfill queue for a given page. Apply the objects.
     * @param index Page index for backfill queue
     */
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

    /**
     * Convert payload to JS Object so we can send it over the wire with
     * relevant attributes attached.
     * @param object Object to convert
     */
    safeConvertToPayload = (object: fabric.Object) => {
        // This works. Don't touch it please
        return object.toObject(["uuid", "latex"]);
    }

    /**
     * Peer has added an object
     * @param index Page of addition
     * @param data Data added
     */
    peerObjectAdded = (index: number, data: Object) => {
        console.log("Received page " + index + " addition from peer");
        const parsed = data as fabric.Object;
        const callbacks = this.map.get(index);
        if (callbacks)
            callbacks?.objectAddedFunc(parsed);
        else
            this.pushBackfill(index, parsed);
    }

    /**
     * Peer has modified an object
     * @param index Page of modification
     * @param data New data to update with
     */
    peerObjectModified = (index: number, data: Object) => {
        console.log("Received page " + index + " modification from peer");
        const parsed = data as fabric.Object;
        const callbacks = this.map.get(index);
        callbacks?.objectModifiedFunc(parsed);
    }

    /**
     * Peer has removed an object
     * @param index Page of removal
     * @param uuid Uuid of removed object
     */
    peerObjectRemoved = (index: number, uuid: string) => {
        console.log("Received page " + index + " removal from peer");
        const callbacks = this.map.get(index);
        callbacks?.objectRemovedFunc(uuid);
    }

    /**
     * Send an object modified event to the server
     * @param index Page index
     * @param data Modified data
     */
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

    /**
     * Send an object added event to the server
     * @param index Page index
     * @param object Added objcet
     */
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

        const json = this.safeConvertToPayload(object);

        // console.log(`Sending: ${json}`);

        this.socket.emit("object-added", index, json);
    }

    /**
     * Send an object removed event to the server
     * @param index Page index
     * @param object Object removed
     */
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