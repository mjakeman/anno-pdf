import * as socketio from "socket.io";
import * as http from "http";
import {User} from "../models/User";
import {backfill, loadPdf, saveAddition, saveModification, savePdf, saveRemoval} from "./canvas";
import Config from "../util/Config";

export const debugLog = (content: any) => {
    if (Config.ENVIRONMENT == 'DEBUG') {
        console.log(content)
    } 
}

/**
 * User data structure
 *
 * IMPORTANT: Match Editor.tsx in frontend
 */
interface UserData {
    uid: string,
    name: string,
    email: string,
}

/**
 * Maps socketIds to documentIds
 */
type SocketMap = {
    [socketId: string]: string;
}

/**
 * Maps documents to socketIds
 */
type DocumentMap = {
    [documentId: string]: Array<string>;
}

/**
 * Maps socketIds to userIds
 */
type UserMap = {
    [socketId: string]: UserData;
}

/**
 * Global map stores
 */
const socketMap: SocketMap = {};
const documentMap: DocumentMap = {};
const userMap: UserMap = {};

/**
 * User has connected
 * @param socket Socket instance for user
 */
const on_connect = async (socket: socketio.Socket) => {
    debugLog(socket.id + " user connected");

    /**
     * Guard against invalid user connections (i.e. not handshaked)
     * @param socket Socket instance
     */
    const guard = (socket: socketio.Socket) => {
        if (socketMap[socket.id] == undefined || userMap[socket.id] == undefined) {
            console.error(`ERROR: ${socket.id} reconnected without sending data!`);
        }
    };

    /**
     * Terminate with an error message which we display to the client
     * @param socket Socket instance
     * @param message Error message
     */
    const disconnectWithError = (socket: socketio.Socket, message: string) => {
        console.error(message);
        socket.emit('error', message);
        socket.disconnect();
    }

    /**
     * Client has initiated a handshake
     */
    socket.on('initial-data', async (userId: string, documentId: string) => {
        try {
            if (!userId || !documentId) {
                disconnectWithError(socket, "UserId or DocumentId is null");
                return;
            }

            // Join room
            const user = await User.findOne({ uid: userId });

            if (!user) {
                disconnectWithError(socket, "User does not exist in database");
                return;
            }

            userMap[socket.id] = { uid: userId, name: user.get('name'), email: user.get('email') };

            debugLog("broadcasting: " + JSON.stringify(userMap[socket.id]));

            socket.join(documentId);
            socket.to(documentId).emit('peer-connected', userMap[socket.id]);

            // Fetch users in target room
            socket.in(documentId).fetchSockets().then((peers) => {
                for (const peerSocket of peers) {
                    const peerUserData = userMap[peerSocket.id];
                    debugLog("backfill: " + JSON.stringify(peerUserData));
                    socket.emit('peer-connected', peerUserData);
                }
            });

            // Set up socket map
            socketMap[socket.id] = documentId;

            // Set up document map
            if (documentMap[documentId] == undefined) {
                documentMap[documentId] = Array(socket.id);

                // LOAD DOCUMENT (ONLY DO THIS ONCE)
                await loadPdf(documentId);

                // Only now are we ready to backfill
            }
            else {
                documentMap[documentId].push(socket.id);
            }

            debugLog(`[${documentId}] ${socket.id}: joined room ${documentId}`);

            // Initialise canvas
            const backfillMap = backfill(documentId);
            debugLog(`backfillMap`);
            debugLog(backfillMap);

            for (let [pageNumber, annotations] of backfillMap) {
                for (let obj of annotations) {
                    socket.emit('peer-added', pageNumber, obj);
                }
                debugLog(`Pushed ${annotations.length} backfill objects to page ${pageNumber}`);
            }

        } catch (e) {
            disconnectWithError(socket, e.toString());
        }
    });

    /**
     * Client has modified an object
     */
    socket.on("object-modified", (index: number, data: any) => {
        try {
            guard(socket);

            const documentId = socketMap[socket.id];
            if (!data.uuid) {
                throw Error("No uuid detected on object. Ignoring");
            }

            debugLog(`[${documentId}] ${socket.id}: on page ${index} modified object ${data.uuid} of type ${data.type}`);
            socket.to(documentId).emit('peer-modified', index, data);

            saveModification(documentId, index, data);
        } catch (e) {
            disconnectWithError(socket, e.toString());
        }
    });

    /**
     * Client has added an object
     */
    socket.on('object-added', (index: number, data: any) => {
        try {
            guard(socket);

            if (!data.uuid) {
                throw Error("No uuid detected on object. Ignoring");
            }

            const documentId = socketMap[socket.id];

            debugLog(`[${documentId}] ${socket.id}: on page ${index} added object ${data.uuid} of type ${data.type}`);
            socket.to(documentId).emit('peer-added', index, data);

            saveAddition(documentId, index, data);
        } catch (e) {
            disconnectWithError(socket, e.toString());
        }
    });

    /**
     * Client has removed an object
     */
    socket.on('object-removed', (index: number, uuid: string) => {
        try {
            guard(socket);

            if (!uuid) {
                throw Error("No uuid provided. Ignoring");
            }

            const documentId = socketMap[socket.id];

            debugLog(`[${documentId}] ${socket.id}: on page ${index} removed object ${uuid}`);
            socket.to(documentId).emit('peer-removed', index, uuid);

            saveRemoval(documentId, index, uuid);
        } catch (e) {
            disconnectWithError(socket, e.toString());
        }
    });

    /**
     * Client has disconnected. Clean up relevant data and
     * clean references from maps
     */
    socket.on('disconnect', () => {
        try {
            guard(socket);

            const documentId = socketMap[socket.id];
            delete socketMap[socket.id];

            const userId = userMap[socket.id].uid;
            delete userMap[socket.id];

            socket.to(documentId).emit('peer-disconnected', userId);

            const index = documentMap[documentId].indexOf(socket.id);
            delete documentMap[documentId][index];

            debugLog(`[${documentId}] ${socket.id}: left room ${documentId}`);

            // Save document
            savePdf(documentId);

        } catch (e) {
            disconnectWithError(socket, e.toString());
        }
    });
}

/**
 * Export a hook for the server to integrate
 * @param server HTTP Server
 */
export default (server: http.Server) => {
    const io = new socketio.Server(server, {
        cors: {
            origin: '*'
        }
    });

    io.on("connection", on_connect);
}