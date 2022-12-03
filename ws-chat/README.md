# Chat app using the ws library

Run as follows:

```shell
npm install
node index.js
```

Now open two browser and open consoles inside them. Execute the following
commands in each console:

```javascript
let ws = new WebSocket('ws://localhost:8080');
ws.onmessage = (message) => console.log(message.data);
ws.send('Hello');
```

To load test this server see instructions under chat-test.
