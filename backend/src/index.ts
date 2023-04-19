import * as express from "express";
import * as http from "http";
import * as socketio from "socket.io";

const port = 8080;
const app = express.default();

app.get("/", (_req, res) => {
    res.send({ uptime: process.uptime() });
});

const server = http.createServer(app);
const io = new socketio.Server(server);

type SocketMap = {
    [key: string]: string;
}

const socketMap: SocketMap = {};

io.on("connection", async (socket) => {
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
});

server.listen(port, () => {
    console.log(`Listening to the server on ${port}`);
});