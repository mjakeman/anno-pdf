import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
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

io.on("connection", (socket) => {
   console.log("user connected");

   socket.on('disconnect', () => {
       console.log("user disconnected");
   })
});

server.listen(port, () => {
    console.log(`Listening to the server on ${port}`);
});