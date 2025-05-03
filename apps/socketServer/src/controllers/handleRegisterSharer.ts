import { WebSocketServer, WebSocket } from "ws";
import { redisPub, redisSub } from "../index.js";

interface customWebSocket extends WebSocket {
  userId: string;
  watchId?: string;
}

const getCodeChannel = (id: string) => `code:${id}`;

export const handleRegisterSharer = async (
  ws: customWebSocket,
  data: { userId: string; initialCode: string }
) => {
  ws.userId = data.userId;
  console.log(`Sharer ${data.userId} connected`);
  const channel = getCodeChannel(ws.userId);
  await redisPub.publish(
    channel,
    JSON.stringify({ message: "CODE", data: data.initialCode })
  );
  await redisPub.set(`latest:code:${ws.userId}`, data.initialCode);
};
