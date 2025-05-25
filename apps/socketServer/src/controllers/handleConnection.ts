import { getCodeChannel, checkIfCodeChannelExists } from "../utils/index.js";
import { MessagePayload, isMessagePayload } from "../utils/messagePayload.js";
import { handleRegisterViewer } from "./handleRegisterViewer.js";
import { handleRegisterSharer } from "./handleRegisterSharer.js";
import { customWebSocket } from "../utils/customWebSocket.js";
import { handleAllowEdit } from "./handleAllowEdit.js";
import { handleLiveShare } from "./handleShare.js";
import { redisPub } from "../index.js";
import { handleLanguageUpdate } from "./handleLanguageUpdate.js";

export const handleConnection = async (ws: customWebSocket) => {
  console.log("new connection");
  ws.on("message", async (rawMessage) => {
    let data: MessagePayload;

    try {
      const parsed = JSON.parse(rawMessage.toString());

      if (!isMessagePayload(parsed)) {
        ws.close(4003, "Invalid message structure");
        return;
      }
      data = parsed;
    } catch (err) {
      console.error("Invalid JSON:", err);
      ws.close(4001, "Malformed message");
      return;
    }

    try {
      switch (data.message) {
        case "REGISTER_VIEWER":
          await handleRegisterViewer(ws, data.data);
          break;

        case "REGISTER_SHARER":
          await handleRegisterSharer(ws, data.data);
          break;

        case "REALTIME_CODE":
          await handleLiveShare(ws, data.data);
          break;

        case "ALLOW_EDIT":
          handleAllowEdit(ws, data.data);
          break;

        case "LANGUAGE_UPDATE":
          handleLanguageUpdate(ws, data.data);
          await redisPub.set(
            `latest:language${ws.userId}`,
            JSON.stringify(data.data),
          );
          break;

        default:
          ws.close(4002, "Unknown message type");
          return;
      }
    } catch (err) {
      console.error(`Error handling message ${data.message}:`, err);
      ws.close(4500, "Internal server error");
    }
  });

  ws.on("close", async () => {
    const { userId, watchId, redisSub } = ws;

    try {
      if (redisSub) {
        await redisSub.unsubscribe();
        await redisSub.quit();
        console.log(`Redis subscriber for ${userId} disconnected.`);
      }

      if (watchId) {
        // Viewer disconnect logic
        const viewerKey = `viewers:${watchId}`;
        const channel = getCodeChannel(watchId);

        await redisPub.hDel(viewerKey, userId);
        const allViewers = await redisPub.hVals(viewerKey);
        const viewerList = allViewers.map((v) => JSON.parse(v));

        await redisPub.publish(
          channel,
          JSON.stringify({
            message: "VIEWER_UPDATE",
            data: viewerList,
          }),
        );
      } else {
        // Sharer disconnect logic
        const channel = getCodeChannel(userId);

        if (await checkIfCodeChannelExists(userId)) {
          await redisPub.publish(
            channel,
            JSON.stringify({
              message: "SHARING_STOPPED",
            }),
          );
        }

        await redisPub.del(`latest:code:${userId}`);
        await redisPub.del(`viewers:${userId}`);
      }
    } catch (err) {
      console.error("Error during socket close cleanup:", err);
    }
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
    ws.close(1011, "Unexpected WebSocket error");
  });
};

export { redisPub };
