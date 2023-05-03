import * as express from "express";
import * as http from "http";
import mongoose from "mongoose";
import cors from "cors";
import Config from "./util/Config";

const port = Config.PORT;
const app = express.default();

// Setup body-parser
app.use(express.json());

// Setup our routes.
import routes from './routes/appRoutes';
import hook from "./sockets/hook";
app.use('/', routes);

// Use cors
app.use(cors);

const server = http.createServer(app);

// setup socket.io
hook(server);

mongoose.connect(Config.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        server.listen(port, () => {
            console.log(`Listening to the server on ${port}`);
        });
    })