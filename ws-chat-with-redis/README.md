# Chat app using the ws library + scaling with Redis

In this example we horizontally scale the chat application using multiple web
socket servers behind a load balancer (HAProxy). Messages are published to all
websocket server using a Redis backplane.

First build an image for the websocket-server:

```shell
docker build -t nareshbhatia/websocket-server:1.0.0 .
```

Verify that the image was created on the local machine:

```shell
docker images -a
```

Now run Docker Compose to start all the containers:

```shell
docker-compose up
```

Finally, run the ws-client page in 3 browser windows and start typing messages.
You will see that a message typed in one window is echoed in all.

To load test this server see instructions under chat-test.
