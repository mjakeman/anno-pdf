import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Server, Socket } from 'socket.io';
import * as http from "http";
import cors from "cors"

dotenv.config();

const port = 8080;
const app = express();

app.use(cors);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

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
   })
});

server.listen(port, () => {
    console.log(`Listening to the server on ${port}`);
});