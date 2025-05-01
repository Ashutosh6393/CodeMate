import { WebSocketServer } from "ws";
import { createClient } from "redis";

interface customWebSockets extends WebSocket {
  userId: string;
}

interface dataType {
  message: string;
  data: string;
}
const redisPub = createClient({ url: "redis://127.0.0.1:6379" });
redisPub.on("error", (err) => console.log("Redis pub Error", err));
const redisSub = createClient();
redisSub.on("error", (err) => console.log("Redis sub Error", err));
const watcher = new Map();

const handleConnection = (ws: customWebSockets, req: Request) => {
  console.log("New connection");
  ws.onmessage = (event) => {
    const data: dataType = JSON.parse(event.data);
    if (data.message === "user") {
      handleNewUser(ws, data.data);
    } else if (data.message === "code") {
      handleCode(ws, data.data);
    }
  };
};

const handleNewUser = (ws: customWebSockets, data: string) => {
  ws.userId = data;
  console.log("New user connected: ", ws.userId);
};

const handleCode = (ws: customWebSockets, data: string) => {
  console.log(data);
};

const socket = new WebSocketServer({ port: 8080 }, () => {
  console.log("Web socket server started at port 8080");
});

try {
  async function handleCode() {
    socket.on("connection", handleConnection);
    await redisPub.connect();
    await redisSub.connect();
  }

  handleCode();
} catch (error) {
  console.log("In the catch block");
  console.log(error);
}
