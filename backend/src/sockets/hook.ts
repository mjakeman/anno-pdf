import * as socketio from "socket.io";
import * as http from "http";

type SocketMap = {
    [key: string]: string;
}

const socketMap: SocketMap = {};

const on_connect = async (socket: socketio.Socket) => {
    console.log(socket.id + " user connected");

    socket.on("set-username", data => {
        console.log("username: " + data);
        socketMap[socket.id] = data;
    });

    socket.on("object-modified", (index: number, uuid: string, data: string) => {
        console.log(socketMap[socket.id] + ": " + index + " / " + uuid + " / " + data);
        socket.broadcast.emit('peer-modified', index, uuid, data);
    });

    socket.on('object-added', (index: number, uuid: string, data: string) => {
        console.log(socketMap[socket.id] + ": " + index + " / " + uuid + " / " + data);
        socket.broadcast.emit('peer-added', index, uuid, data);
    });

    socket.on('disconnect', () => {
        console.log(socket.id + " user disconnected");
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