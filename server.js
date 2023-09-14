import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';

import { handler } from './build/handler.js';

const port = process.env.PORT || 8080; 
const app = express();
const server = createServer(app);

const io = new Server(server);

io.on('connection', (socket) => {
  socket.emit('eventFromServer', 'Hello, World 👋');
});

app.use(handler);

const wss = new WebSocketServer({ server }); // Use the existing HTTP server for WebSocket

const clients = new Map(); // has to be a Map instead of {} due to non-string keys

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

// function for sending a message to every connected client
function serverBroadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});

console.log('The server is running and waiting for connections');
