import * as express from "express";
import * as http from "http";
import * as socketio from "socket.io";
import mongoose from "mongoose";
import Config from "./util/Config";

const port = Config.PORT;
const app = express.default();

// Setup body-parser
app.use(express.json());

// Setup our routes.
import routes from './routes/appRoutes';
app.use('/', routes);

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

mongoose.connect(Config.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        server.listen(port, () => {
            console.log(`Listening to the server on ${port}`);
        });
    })