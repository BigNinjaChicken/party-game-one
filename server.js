import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';

import { handler } from './build/handler.js';
import { resolve } from 'path';

const app = express();
const server = createServer(app);
const port = process.env.PORT || 8080;

const io = new Server(server);

io.on('connection', (socket) => {
  socket.emit('eventFromServer', 'Hello, World 👋');
});

app.use(handler);

const wss = new WebSocketServer({ noServer: true });

const clients = new Map();
const sessions = new Map();

wss.on('connection', (ws) => {
  // Store client information with the WebSocket connection
  const clientId = randomUUID();
  const clientInfo = {
    clientType: "",
    sessionCode: "",
    playerName: "",
    clientId: clientId
  };

  // Store the clientInfo object with the WebSocket connection
  clients.set(ws, clientInfo);
  console.log(`New connection.`);

  ws.on('message', (data) => {
    console.log(`Received: ${data}`);

    const messageJSON = JSON.parse(data);
    const clientInfo = clients.get(ws);

    // Once in session send messages back and forth
    if (sessions.has(clientInfo.sessionCode)) {
      if (clientInfo.clientType === "Unreal") {
        const allSessionUsers = sessions.get(clientInfo.sessionCode);
        for (const sessionUser of allSessionUsers) {
          if (clients.get(sessionUser).clientType === "Web") {
            if (messageJSON.clientId) {
              if (clients.get(sessionUser).clientId == messageJSON.clientId) // if Unreal wants to do a user specific call
                sessionUser.send(JSON.stringify(messageJSON));
            } else {
              sessionUser.send(JSON.stringify(messageJSON));
            }
          }
        }
      } else if (clientInfo.clientType === "Web") {
        const allSessionUsers = sessions.get(clientInfo.sessionCode);
        for (const sessionUser of allSessionUsers) {
          if (clients.get(sessionUser).clientType === "Unreal") {
            messageJSON.clientInfo = clients.get(ws);
            sessionUser.send(JSON.stringify(messageJSON));
            break; // Only 1 Unreal User
          }
        }
      }
      return;
    }

    // Set client type
    if (messageJSON.clientType && clientInfo.clientType === "") {
      clientInfo.clientType = messageJSON.clientType;
      console.log(`Client type updated to: ${clientInfo.clientType}`);
      return;
    }

    // Create a session
    if (messageJSON.gameType) {
      if (clientInfo.clientType === "Unreal") {
        const sessionCode = generateRandomCode(4);

        sessions.set(sessionCode, []);
        sessions.get(sessionCode).push(ws);
        clientInfo.sessionCode = sessionCode;

        const sessionData = {
          sessionCode: sessionCode
        };
        ws.send(JSON.stringify(sessionData));
        console.log("Created Session");
      }
      return;
    }

    // Join a session
    if (messageJSON.bJoinGame && clientInfo.clientType === "Web") {
      const sessionCodeToJoin = messageJSON.sessionCode;

      if (sessions.has(sessionCodeToJoin)) {
        const response = {
          bValidSession: true,
        };
        ws.send(JSON.stringify(response));
        clientInfo.sessionCode = sessionCodeToJoin;
        clientInfo.playerName = messageJSON.playerName;

        sessions.get(sessionCodeToJoin).push(ws);
        console.log(`Web client joined session: ${sessionCodeToJoin}`);
      } else {
        const response = {
          bValidSession: false
        };
        ws.send(JSON.stringify(response));
        console.log("Invalid Room");
      }
      return;
    }
  });

  // Stop tracking the client upon that client closing the connection
  ws.on('close', () => {
    console.log(`Connection closed`);
    sessions.delete(ws);
    clients.delete(ws);
  });
});

function generateRandomCode(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});

console.log('The server is running and waiting for connections');
