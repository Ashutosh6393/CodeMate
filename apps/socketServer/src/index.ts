import { WebSocketServer } from "ws";
import { createClient } from "redis";

import dotenv from "dotenv";

dotenv.config();

interface customWebSockets extends WebSocket {
  userId: string;
}

interface dataType {
  message: string;
  data: string;
}
const redisPub = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});
redisPub.on("error", (err) => console.log("Redis pub Error", err));

const redisSub = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});
redisSub.on("error", (err) => console.log("Redis sub Error", err));

const watcher = new Map();

const handleConnection = (ws: customWebSockets, req: Request) => {
  ws.onmessage = (event) => {
    const data: dataType = JSON.parse(event.data);
    if (data.message === "user") {
      handleNewUser(ws, data.data);
    } else if (data.message === "code") {
      handleCode(ws, data.data);
    } else if (data.message === "watch") {
      console.log("new Watcher");
      watcher.set(data.data, ws);
    }
  };
};

const handleNewUser = (ws: customWebSockets, data: string) => {
  ws.userId = data;
  console.log("New user connected: ", ws.userId);
};

const handleCode = (ws: customWebSockets, data: string) => {
  // ws.send(data);
  console.log(data);

  watcher.forEach((value) => {
    value.send(data);
  });
};

const socket = new WebSocketServer({ port: 8080 }, () => {
  console.log("Web socket server started at port 8080");
});

try {
  async function handleCode() {
    socket.on("connection", handleConnection);
    // await redisPub.connect();
    // await redisSub.connect();
  }

  handleCode();
} catch (error) {
  console.log("In the catch block");
  console.log(error);
}
