import { WebSocketServer, WebSocket } from "ws";
import { redisPub, redisSub } from "../index.js";

interface customWebSocket extends WebSocket {
  userId: string;
  userName: string;
  watchId?: string;
}

const getCodeChannel = (id: string) => `code:${id}`;

export const handleRegisterSharer = async (
  ws: customWebSocket,
  data: { userId: string; userName: string; initialCode: string }
) => {
  ws.userId = data.userId;
  ws.userName = data.userName;

  console.log(`Sharer ${data.userId} connected`);
  const channel = getCodeChannel(ws.userId);
  await redisPub.set(`latest:code:${ws.userId}`, data.initialCode);


  await redisSub.subscribe(channel, (message) => {
    const data = JSON.parse(message);

    try {
      switch (data.message) {
        case "VIEWER_UPDATE":
          ws.send(
            JSON.stringify({ message: "VIEWER_UPDATE", data: data.data })
          );
          break;

        case "CURSOR_POSITION":
          break;

        default:
          break;
      }
    } catch (error) {}
  });

  await redisPub.publish(
    channel,
    JSON.stringify({ message: "REALTIME_CODE", data: data.initialCode })
  );
   
};
