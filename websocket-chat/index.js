import http from 'http';
import ws from 'websocket';

const connections = new Map();
let nextId = 1;

// Create httpServer
const httpServer = http.createServer();

// Create webSocketServer
const WebSocketServer = ws.server;
const webSocketServer = new WebSocketServer({
  httpServer,
});

// Start httpServer
httpServer.listen(8080, () =>
  console.log('WebSocket server listening on port 8080')
);

// Accept connection requests
webSocketServer.on('request', (request) => {
  const connection = request.accept(null, request.origin);
  const connectionId = nextId++;
  connections.set(connectionId, connection);
  console.log(`Connection ${connectionId} accepted`);
  console.log(`Total connections: ${connections.size}`);

  connection.on('message', (message) => {
    const echoMessage = `Connection ${connectionId}: ${message.utf8Data}`;
    console.log(echoMessage);
    [...connections.values()].forEach((connection) => {
      connection.sendUTF(echoMessage);
    });
  });

  connection.on('close', () => {
    console.log(`Connection ${connectionId} closed`);
    connections.delete(connectionId);
    console.log(`Total connections: ${connections.size}`);
  });
});
