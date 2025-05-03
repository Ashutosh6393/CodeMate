import { handleRegisterViewer } from "./handleRegisterViewer.js";
import { handleRegisterSharer } from "./handleRegisterSharer.js";
import { handleLiveShare } from "./handleShare.js";
import { redisSub, redisPub } from "../index.js";
import { WebSocket } from "ws";

interface customWebSocket extends WebSocket {
  userId: string;
  watchId?: string;
}

const getCodeChannel = (id: string) => `code:${id}`;

const checkIfCodeChannelExists = async (id: string) => {
  const channels = await redisPub.pubSubChannels(`code:${id}`);
  return channels.includes(`code:${id}`);
};

export const handleConnection = (ws: customWebSocket) => {
  ws.on("message", async (event) => {
    const data = JSON.parse(event.toString());

    switch (data.message) {
      case "REGISTER_VIEWER":
        await handleRegisterViewer(ws, data.data);
        break;

      case "REGISTER_SHARER":
        handleRegisterSharer(ws, data.data);
        break;

      case "REALTIME_CODE":
        handleLiveShare(ws, data.data);
        break;

      default:
        break;
    }
  });

  ws.on("close", async () => {
    const userId = ws.userId;
    const watchId = ws.watchId;
    

    checkIfCodeChannelExists(userId).then(async (exists) => {
      if (exists) {
        const channel = getCodeChannel(userId);
        await redisPub.publish(channel, JSON.stringify({ message: "CLOSE" }));
      }
    });

    if (watchId) {
      const channel = getCodeChannel(watchId);
      try {
        await redisSub.unsubscribe(channel);
        console.log(`Watcher ${userId} unsubscribed from ${channel}`);
      } catch (e) {
        console.error("Unsubscribe error", e);
      }
    }else if(!watchId){
        await redisPub.del(`latest:code:${userId}`);
    }
  });
};
