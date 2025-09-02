import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import * as dotenv from 'dotenv';
import dbConnect from './dbConnection';
dotenv.config();

// Initialize all variables or constants
const app = express();
const server = createServer(app);
const PORT = process.env.PORT;
const io = new Server(server);

// Enable express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize the mongoDB connection
dbConnect().catch(console.dir);

// 
app.get('/',
    (_req, res) => {
        res.send('Hello World!')
    }
)

// Initialize the socket.io connections
io.on('connection', (socket) => {
    console.log('A user connected')

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
})

// Initialize the http server to start listening for requests
server.listen(PORT, () => {
    console.log('Server running on Port', PORT)
})