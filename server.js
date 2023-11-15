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

const wss = new WebSocketServer({ server });

const clients = new Map();
const sessions = new Map();

wss.on('connection', (ws) => {
  // Store client information with the WebSocket connection
  const clientInfo = {
    clientType: "",
    sessionCode: "",
    playerName: "",
    recentMessageRecieved: "",
  };

  // Store the clientInfo object with the WebSocket connection
  clients.set(ws, clientInfo);
  console.log(`New connection.`);

  ws.on('message', (data) => {
    console.log(`Received: ${data}`);

    const messageJSON = JSON.parse(data);
    const clientInfo = clients.get(ws);

    // Add logic to update the game stage
    if (messageJSON.Stage && clientInfo.clientType === "Unreal") {
      const session = sessions.get(clientInfo.sessionCode);
      if (session) {
        session.stage = messageJSON.Stage;
      }
    }

    // Once in session send messages back and forth
    if (sessions.has(clientInfo.sessionCode)) {
      const session = sessions.get(clientInfo.sessionCode);
      const allSessionUsers = session.clients;

      if (clientInfo.clientType === "Unreal") {
        for (const sessionUser of allSessionUsers) {
          if (clients.get(sessionUser).clientType === "Web") {
            if (messageJSON.playerName) {
              if (clients.get(sessionUser).playerName == messageJSON.playerName) // if Unreal wants to do a user specific call
                sessionUser.send(JSON.stringify(messageJSON));
                if (!messageJSON.Score) clients.get(sessionUser).recentMessageRecieved = JSON.stringify(messageJSON);
            } else {
              sessionUser.send(JSON.stringify(messageJSON));
              if (!messageJSON.Score)clients.get(sessionUser).recentMessageRecieved = JSON.stringify(messageJSON);
            }
          }
        }
      } else if (clientInfo.clientType === "Web") {
        for (const sessionUser of allSessionUsers) {
          if (clients.get(sessionUser).clientType === "Unreal") {
            messageJSON.clientInfo = clients.get(ws);
            sessionUser.send(JSON.stringify(messageJSON));
            if (!messageJSON.Score)clients.get(sessionUser).recentMessageRecieved = JSON.stringify(messageJSON);
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

        // Initialize the session with an empty client list and a starting stage
        sessions.set(sessionCode, { clients: [ws], stage: 2 });
        clientInfo.sessionCode = sessionCode;

        const sessionData = {
          sessionCode: sessionCode
        };
        ws.send(JSON.stringify(sessionData));
        console.log("Created Session");
      }
      return;
    }

    // Join or Rejoin a session
    if (messageJSON.bJoinGame && clientInfo.clientType === "Web") {
      const sessionCodeToJoin = messageJSON.sessionCode;

      if (sessions.has(sessionCodeToJoin)) {
        const session = sessions.get(sessionCodeToJoin);
        const sessionClients = session.clients;
        let reconnected = false;

        for (const sessionClient of sessionClients) {
          const sessionClientInfo = clients.get(sessionClient);

          // Reconnect if the playerName match
          if (sessionClientInfo.playerName === messageJSON.playerName) {
            console.log(`Reconnecting client: ${messageJSON.playerName}`);
            clientInfo.sessionCode = sessionClientInfo.sessionCode;
            clientInfo.playerName = sessionClientInfo.playerName;
            clientInfo.recentMessageRecieved = sessionClientInfo.recentMessageRecieved;
            sessionClients[sessionClients.indexOf(sessionClient)] = ws; // Update the connection
            reconnected = true;
            break;
          }
        }

        if (!reconnected) {
          console.log(`New client joining: ${messageJSON.playerName}`);
          clientInfo.playerName = messageJSON.playerName;
          clientInfo.sessionCode = messageJSON.sessionCode;
          sessionClients.push(ws);
        }

        // Send current game stage along with reconnection confirmation
        ws.send(JSON.stringify({ bValidSession: true, currentStage: session.stage }));

        // Send information they need for the stage
        if (reconnected) {
          ws.send( clientInfo.recentMessageRecieved );
        }
      } else {
        ws.send(JSON.stringify({ bValidSession: false }));
        console.log("Invalid Room");
      }
      return;
    }
  });

  // Stop tracking the client upon that client closing the connection
  ws.on('close', () => {
    console.log(`Connection closed`);
  });
});

function generateRandomCode(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

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
