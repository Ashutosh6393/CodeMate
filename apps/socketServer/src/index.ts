import { WebSocketServer } from "ws";
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

interface customWebSockets extends WebSocket {
  userId: string;
  watchId?: string;
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

const rooms = new Map<string, customWebSockets[]>();

const handleConnection = (ws: customWebSockets, req: Request) => {
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.message) {
      case "REGISTER_VIEWER":
        handleRegisterViewer(ws, data.data);
        break;

      case "REGISTER_SHARER":
        handleRegisterSharer(ws, data.data);
        break;

      case "code":  
        handleShare(ws, data.data);
        break;

      default:
        break;
    }
  };

  ws.onclose = () => {
    if (rooms.get(ws.userId)) {
      rooms.get(ws.userId)?.forEach((socket) => {
        socket.close(1000, "Sharing Stopped");
      });
    }

    if( ws.watchId){
      const newArray = rooms.get(ws.watchId)?.filter((socket) => socket.userId !== ws.userId);
      rooms.set(ws.watchId, newArray!);
    }
  };
};

const handleRegisterViewer = (
  ws: customWebSockets,
  data: { userId: string; watchId: string }
) => {
  ws.userId = data.userId;
  ws.watchId = data.watchId;
  if (rooms.get(data.watchId)) {
    rooms.get(data.watchId)?.push(ws);
  } else {
    ws.close(1007, "Invalid Watch Id");
  }
};

const handleRegisterSharer = (ws: customWebSockets, data: string) => {
  ws.userId = data;
  if (!rooms.get(ws.userId)) {
    rooms.set(ws.userId, []);
  }
};

const handleShare = (ws: customWebSockets, data: string) => {
  if (rooms.get(ws.userId)) {
    rooms.get(ws.userId)?.forEach((socket) => {
      socket.send(data);
    });
  }
};

const socket = new WebSocketServer({ port: 8080 }, () => {
  console.log("Web socket server started at port 8080");
});

try {
  async function handleCode() {
    socket.on("connection", handleConnection);
  }
  handleCode();
} catch (error) {
  console.log("In the catch block");
  console.log(error);
}
