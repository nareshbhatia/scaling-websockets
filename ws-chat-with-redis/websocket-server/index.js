import redis from 'redis';
import { WebSocketServer } from 'ws';

const WSS_ID = process.env.WSS_ID;
const CHAT_CHANNEL = 'live-chat';

const sockets = new Map();
let nextId = 1;

async function main() {
  // Create webSocketServer
  const webSocketServer = new WebSocketServer({ port: 8080 });
  console.log(`WSS-${WSS_ID} listening on port 8080`);

  // Create Redis publisher and subscriber
  const redisPublisher = redis.createClient({
    url: 'redis://rds:6379',
  });
  const redisSubscriber = redisPublisher.duplicate();

  // Set Redis error handlers
  redisPublisher.on('error', (err) =>
    console.log(`WSS-${WSS_ID}: redis publisher error:`, err),
  );
  redisSubscriber.on('error', (err) =>
    console.log(`WSS-${WSS_ID}: redis subscriber error:`, err),
  );

  // Connect to Redis
  await redisPublisher.connect();
  await redisSubscriber.connect();

  // Subscribe to CHAT_CHANNEL on Redis
  await redisSubscriber.subscribe(CHAT_CHANNEL, (message) => {
    try {
      [...sockets.values()].forEach((socket) => {
        socket.send(message);
      });
    } catch (error) {
      console.log(`WSS-${WSS_ID} Error:`, error);
    }
  });
  console.log(`WSS-${WSS_ID}: subscribed successfully to ${CHAT_CHANNEL}`);

  // Accept websocket connection requests
  webSocketServer.on('connection', (ws) => {
    const socketId = nextId++;
    sockets.set(socketId, ws);
    console.log(`WSS-${WSS_ID}: Socket ${socketId} created`);
    console.log(`WSS-${WSS_ID}: Total sockets: ${sockets.size}`);

    ws.on('message', async (data) => {
      const echoMessage = `WSS-${WSS_ID}: Socket ${socketId}: ${data}`;
      // Publish message to Redis
      await redisPublisher.publish(CHAT_CHANNEL, echoMessage);
    });

    ws.on('close', () => {
      console.log(`WSS-${WSS_ID}: Socket ${socketId} closed`);
      sockets.delete(socketId);
      console.log(`WSS-${WSS_ID}: Total sockets: ${sockets.size}`);
    });
  });
}

await main();
