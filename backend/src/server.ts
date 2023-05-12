import * as express from "express";
import * as http from "http";
import mongoose from "mongoose";
import cors from "cors";
import Config from "./util/Config";
import routes from './routes/appRoutes';
import hook from "./sockets/controller";

const port = Config.PORT;
const app = express.default();

// Setup body-parser
app.use(express.json());
// Use cors
app.use(cors());

// Setup our api routes.
app.use('/', routes);

// Basic health check page
app.get('/', function(_req, res){
    res.send("Anno Backend API - Did you want <a href='https://anno-pdf.herokuapp.com/'>anno-pdf.herokuapp.com/</a>?");
});

const server = http.createServer(app);

// setup socket.io
hook(server);

// Connect to the database, then listen on server
mongoose.connect(Config.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        server.listen(port, () => {
            console.log(`Listening to the server on ${port}`);
        });
    })