import * as socketio from "socket.io";
import * as http from "http";
import {User} from "../models/User";

// Match Editor.tsx in frontend
interface UserData {
    id: string,
    name: string,
    email: string,
}

// Maps socketIds to documents
type SocketMap = {
    [socketId: string]: string;
}

// Maps documents to socketIds
type DocumentMap = {
    [documentId: string]: Array<string>;
}

// Maps socketIds to userIds
type UserMap = {
    [socketId: string]: UserData;
}

const socketMap: SocketMap = {};
const documentMap: DocumentMap = {};
const userMap: UserMap = {};

const on_connect = async (socket: socketio.Socket) => {
    console.log(socket.id + " user connected");

    const guard = (socket: socketio.Socket) => {
        if (socketMap[socket.id] == undefined || userMap[socket.id] == undefined) {
            console.error(`ERROR: ${socket.id} reconnected without sending data!`);
        }
    };

    const disconnectWithError = (socket: socketio.Socket, message: string) => {
        console.error(message);
        socket.emit('error', message);
        socket.disconnect();
    }

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

            userMap[socket.id] = { id: userId, name: user.get('name'), email: user.get('email') };

            console.log("sending: " + JSON.stringify(userMap[socket.id]));

            socket.join(documentId);
            socket.to(documentId).emit('peer-connected', userMap[socket.id]);

            // Fetch users in target room
            socket.in(documentId).fetchSockets().then((peers) => {
                for (const peerSocket of peers) {
                    const peerUserData = userMap[peerSocket.id];
                    socket.emit('peer-connected', peerUserData);
                }
            });

            // Set up socket map
            socketMap[socket.id] = documentId;

            // Set up document map
            if (documentMap[documentId] == undefined) {
                documentMap[documentId] = Array(socket.id);
            }
            else {
                documentMap[documentId].push(socket.id);
            }

            console.log(`[${documentId}] ${socket.id}: joined room ${documentId}`);
        } catch (e) {
            disconnectWithError(socket, e.toString());
        }
    });

    socket.on("object-modified", (index: number, uuid: string, data: string) => {
        try {
            guard(socket);

            const documentId = socketMap[socket.id];

            console.log(`[${documentId}] ${socket.id}: on page ${index} modified object ${uuid}`); // with data:\n${JSON.stringify(data)}`);
            socket.to(documentId).emit('peer-modified', index, uuid, data);
        } catch (e) {
            disconnectWithError(socket, e.toString());
        }
    });

    socket.on('object-added', (index: number, uuid: string, data: string) => {
        try {
            guard(socket);

            const documentId = socketMap[socket.id];

            console.log(`[${documentId}] ${socket.id}: on page ${index} added object ${uuid}`); // with data:\n${JSON.stringify(data)}`);
            socket.to(documentId).emit('peer-added', index, uuid, data);
        } catch (e) {
            disconnectWithError(socket, e.toString());
        }
    });

    socket.on('disconnect', () => {
        try {
            guard(socket);

            const documentId = socketMap[socket.id];
            delete socketMap[socket.id];

            const userId = userMap[socket.id].id;
            delete userMap[socket.id];

            socket.to(documentId).emit('peer-disconnected', userId);

            const index = documentMap[documentId].indexOf(socket.id);
            delete documentMap[documentId][index];

            console.log(`[${documentId}] ${socket.id}: left room ${documentId}`);
        } catch (e) {
            disconnectWithError(socket, e.toString());
        }
    });
}

export default (server: http.Server) => {
    const io = new socketio.Server(server, {
        cors: {
            // TODO: https://anno-pdf.herokuapp.com/
            origin: '*'
        }
    });

    io.on("connection", on_connect);
}