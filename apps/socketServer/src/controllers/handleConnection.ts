import { handleRegisterViewer } from "./handleRegisterViewer.js";
import { handleRegisterSharer } from "./handleRegisterSharer.js";
import { handleCursorPosition } from "./handleCursorPosition.js";
import { handleLiveShare } from "./handleShare.js";
import { redisSub, redisPub } from "../index.js";
import { WebSocket } from "ws";

interface customWebSocket extends WebSocket {
  userId: string;
  userName: string;
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
      
      case "CURSOR_POSITION":
        handleCursorPosition();
        break;

      default:
        break;
    }
  });

  ws.on("close", async () => {
    const userId = ws.userId;
    const watchId = ws.watchId;

    if (watchId) {
      //* if watcher disconnects

      const viewerKey = `viewers:${watchId}`;
      const channel = getCodeChannel(watchId);

      // 1. Remove viewer from Redis hash
      await redisPub.hDel(viewerKey, userId);

      // 2. Notify other viewers
      const allViewers = await redisPub.hVals(viewerKey);
      const viewerList = allViewers.map((v) => JSON.parse(v));
      console.log("viewerrrr list", viewerList);
      await redisPub.publish(
        channel,
        JSON.stringify({ message: "VIEWER_UPDATE", data: viewerList })
      );

      try {
        await redisSub.unsubscribe(channel);
        console.log(`Watcher ${userId} unsubscribed from ${channel}`);
      } catch (e) {
        console.error("Unsubscribe error", e);
      }
    } else if(!watchId) {
      //* if sharer disconnects

      const exists = await checkIfCodeChannelExists(userId);
      const channel = getCodeChannel(userId);

      if (exists) {
        // Notify all viewers
        await redisPub.publish(
          channel,
          JSON.stringify({ message: "SHARING_STOPPED" })
        );
      }

      //cleanup keys
      await redisPub.del(`latest:code:${userId}`);
      await redisPub.del(`viewers:${userId}`);
    }
  });
};
