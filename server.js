// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';

// import { handler } from './build/handler.js';

// const port = process.env.PORT || 8080;
// const app = express();
// const server = createServer(app);

// const io = new Server(server);

// io.on('connection', (socket) => {
//   socket.emit('eventFromServer', 'Hello, World 👋');
// });

// // SvelteKit should handle everything else using Express middleware
// // https://github.com/sveltejs/kit/tree/master/packages/adapter-node#custom-server
// app.use(handler);

// // 0.0.0.0 is used for Google Cloud
// // const host = '0.0.0.0'
// const serverHost = 'localhost'
// server.listen(port, serverHost, () => {
//   console.log(`Server is running on ${serverHost}:${port}`);
//   console.log(`http://localhost:${port}`)
// });

import WebSocket, { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';
const clients = new Map(); // has to be a Map instead of {} due to non-string keys
const wss = new WebSocketServer({ port: 8080 }); // initiate a new server that listens on port 8080

// set up event handlers and do other things upon a client connecting to the server
wss.on('connection', (ws) => {
    // create an id to track the client
    const id = randomUUID();
    clients.set(ws, id);
    console.log(`new connection assigned id: ${id}`);

    // send a message to all connected clients upon receiving a message from one of the connected clients
    ws.on('message', (data) => {
        console.log(`received: ${data}`);
        serverBroadcast(`Client ${clients.get(ws)} ${data}`);
    });

    // stop tracking the client upon that client closing the connection
    ws.on('close', () => {
        console.log(`connection (id = ${clients.get(ws)}) closed`);
        clients.delete(ws);
    });

    // send the id back to the newly connected client
    ws.send(`You have been assigned id ${id}`);
});

// send a message to all the connected clients about how many of them there are every 15 seconds
setInterval(() => {
    console.log(`Number of connected clients: ${clients.size}`);
    serverBroadcast(`Number of connected clients: ${clients.size}`);
}, 15000);

// function for sending a message to every connected client
function serverBroadcast(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

console.log('The server is running and waiting for connections');