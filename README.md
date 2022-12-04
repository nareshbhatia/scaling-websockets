# Scaling WebSockets

This project shows how to scale WebSockets using a load balancer and a Redis
backplane. It consists of 3 subprojects:

1. **websocket-chat**: This is an unscaled version of a chat server consisting
   of only one WebSocket server. It uses the
   [websocket](https://github.com/theturtle32/WebSocket-Node) library to
   implement WebSockets.
2. **ws-chat**: This is an unscaled version of a chat server consisting of only
   one WebSocket server. It uses the more popular
   [ws](https://github.com/websockets/ws) library to implement WebSockets.
3. **ws-chat-with-redis**: This is a scaled version of a chat server consisting
   of 3 WebSocket servers. The servers are load-balanced using HAProxy. Chat
   messages are echoed on all 3 severs using a Redis backplane.

Load testing is performed using [Artillery](https://www.artillery.io/). See
testing approach and results under [chat-test](chat-test).
