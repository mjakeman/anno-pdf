import * as express from "express";
import * as http from "http";
import mongoose from "mongoose";
import cors from "cors";
import Config from "./util/Config";
import nodeMailer from "nodemailer"

const port = Config.PORT;

export const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: Config.GMAIL,
        pass: Config.GMAIL_PASSWORD
    }
})

const app = express.default();

// Setup body-parser
app.use(express.json());
// Use cors
app.use(cors());

// Setup our routes.
import routes from './routes/appRoutes';
import hook from "./sockets/hook";
app.use('/', routes);
app.get('/', function(_req, res){
    res.send("Anno Backend API - Did you want <a href='https://anno-pdf.herokuapp.com/'>anno-pdf.herokuapp.com/</a>?");
});

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