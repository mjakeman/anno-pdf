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

    socket.on("object-modified", (index: number, data: any) => {
        console.log(socketMap[socket.id] + ": " + index + " / " + data);
        socket.broadcast.emit('peer-modified', index, data);
    });

    socket.on('object-added', (index: number, data: any) => {
        console.log(socketMap[socket.id] + ": " + index + " / " + data);
        socket.broadcast.emit('peer-added', index, data);
    });

    socket.on('disconnect', () => {
        console.log(socket.id + " user disconnected");
    });
}

export default (server: http.Server) => {
    const io = new socketio.Server(server);

    io.on("connection", on_connect);
}