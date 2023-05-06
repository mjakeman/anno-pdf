import * as socketio from "socket.io";
import * as http from "http";

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
    [socketId: string]: string;
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

    socket.on('initial-data', (userId: string, documentId: string) => {
        try {
            // Fetch users in target room
            const peers = socket.in(documentId).fetchSockets().then(() => {
                for (const peerSocketId in peers) {
                    const peerUserId = userMap[peerSocketId];
                    socket.emit('peer-connected', peerUserId);
                }
            });

            // Join room
            socket.join(documentId);
            socket.to(documentId).emit('peer-connected', userId);

            socketMap[socket.id] = documentId;
            userMap[socket.id] = userId;
            if (documentMap[documentId] == undefined) {
                documentMap[documentId] = Array(socket.id);
            }
            else {
                documentMap[documentId].push(socket.id);
            }

            console.log(`[${documentId}] ${socket.id}: joined room ${documentId}`);
        } catch (e) {
            console.error(e);
            socket.disconnect();
        }
    });

    socket.on("object-modified", (index: number, uuid: string, data: string) => {
        try {
            guard(socket);

            const documentId = socketMap[socket.id];

            console.log(`[${documentId}] ${socket.id}: on page ${index} modified object ${uuid}`); // with data:\n${JSON.stringify(data)}`);
            socket.to(documentId).emit('peer-modified', index, uuid, data);
        } catch (e) {
            console.error(e);
            socket.disconnect();
        }
    });

    socket.on('object-added', (index: number, uuid: string, data: string) => {
        try {
            guard(socket);

            const documentId = socketMap[socket.id];

            console.log(`[${documentId}] ${socket.id}: on page ${index} added object ${uuid}`); // with data:\n${JSON.stringify(data)}`);
            socket.to(documentId).emit('peer-added', index, uuid, data);
        } catch (e) {
            console.error(e);
            socket.disconnect();
        }
    });

    socket.on('disconnect', () => {
        try {
            guard(socket);

            const documentId = socketMap[socket.id];
            delete socketMap[socket.id];

            const userId = userMap[socket.id];
            delete userMap[socket.id];

            socket.to(documentId).emit('peer-disconnected', userId);

            console.log(JSON.stringify(documentMap));
            const index = documentMap[documentId].indexOf(socket.id);
            delete documentMap[documentId][index];

            console.log(`[${documentId}] ${socket.id}: left room ${documentId}`);
        } catch (e) {
            console.error(e);
            socket.disconnect();
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