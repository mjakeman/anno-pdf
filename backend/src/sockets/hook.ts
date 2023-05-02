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

    socket.on("count-changed", data => {
        console.log(socketMap[socket.id] + ": " + data);
    });

    socket.on('disconnect', () => {
        console.log(socket.id + " user disconnected");
    });
}

export default (server: http.Server) => {
    const io = new socketio.Server(server);

    io.on("connection", on_connect);
}