import { WebSocketServer } from 'ws';

const sockets = new Map();
let nextId = 1;

// Create webSocketServer
const webSocketServer = new WebSocketServer({ port: 8080 });
console.log('WebSocket server listening on port 8080');

// Accept connection requests
webSocketServer.on('connection', (ws) => {
  const socketId = nextId++;
  sockets.set(socketId, ws);
  console.log(`Socket ${socketId} created`);
  console.log(`Total sockets: ${sockets.size}`);

  ws.on('message', (data) => {
    const echoMessage = `Socket ${socketId}: ${data}`;
    [...sockets.values()].forEach((socket) => {
      socket.send(echoMessage);
    });
  });

  ws.on('close', () => {
    console.log(`Socket ${socketId} closed`);
    sockets.delete(socketId);
    console.log(`Total sockets: ${sockets.size}`);
  });
});
