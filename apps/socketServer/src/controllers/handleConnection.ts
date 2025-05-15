import { getCodeChannel, checkIfCodeChannelExists } from "../utils/index.js"
import { redisPub, customWebSocket, redisConfig } from "../index.js";
import { handleRegisterViewer } from "./handleRegisterViewer.js";
import { handleRegisterSharer } from "./handleRegisterSharer.js";
import { handleCursorPosition } from "./handleCursorPosition.js";
import { handleLiveShare } from "./handleShare.js";
import { handleAllowEdit } from "./handleAllowEdit.js";

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

      case "ALLOW_EDIT":
        handleAllowEdit(ws, data.data);
        // console.log("allow edit", data.data); // ws.allowEdit = data.data;
        break;

      default:
        break;
    }
  });

  ws.on("close", async () => {
    const { userId, watchId, redisSub } = ws;

    if (redisSub) {
      try {
        await redisSub.unsubscribe();
        await redisSub.quit();
        console.log(`Redis subscriber for ${userId} disconnected.`);
      } catch (err) {
        console.error("Redis cleanup error: ", err);
      }
    }

    if (watchId) {
      //* if watcher disconnects

      const viewerKey = `viewers:${watchId}`;
      const channel = getCodeChannel(watchId);

      await redisPub.hDel(viewerKey, userId);
      const allViewers = await redisPub.hVals(viewerKey);
      const viewerList = allViewers.map((v) => JSON.parse(v));
      await redisPub.publish(
        channel,
        JSON.stringify({ message: "VIEWER_UPDATE", data: viewerList })
      );
    } else if (!watchId) {
      //* if sharer disconnects

      const exists = await checkIfCodeChannelExists(userId);
      const channel = getCodeChannel(userId);

      if (exists) {
        await redisPub.publish(
          channel,
          JSON.stringify({ message: "SHARING_STOPPED" })
        );
      }

      await redisPub.del(`latest:code:${userId}`);
      await redisPub.del(`viewers:${userId}`);
    }
  });
};
