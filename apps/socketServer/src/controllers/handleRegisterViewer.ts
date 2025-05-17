import { redisPub } from "./handleConnection.js";
import { getCodeChannel } from "../utils/index.js";
import { createClient } from "redis";
import { customWebSocket } from "../utils/customWebSocket.js";
import { redisConfig } from "../utils/redisConfig.js";

export const handleRegisterViewer = async (
  ws: customWebSocket,
  data: { userId: string; userName: string; watchId: string }
) => {
  try {
    const channel = getCodeChannel(data.watchId);
    ws.userId = data.userId;
    ws.watchId = data.watchId;
    ws.userName = data.userName;

    // Validate if sharer's session exists
    const exists = await redisPub.exists(`latest:code:${data.watchId}`);
    if (!exists) {
      ws.close(4000, "INVALID_WATCH_ID");
      return;
    }

    // Create redis subscriber
    const viewerRedisSub = createClient(redisConfig);
    viewerRedisSub.on("error", (err) =>
      console.error("Redis Viewer Sub Error", err)
    );
    await viewerRedisSub.connect();
    ws.redisSub = viewerRedisSub;

    // Add viewer to Redis Hash
    await redisPub.hSet(
      `viewers:${data.watchId}`,
      data.userId,
      JSON.stringify({ userId: data.userId, username: data.userName })
    );

    console.log(`[Viewer Connected]: ${data.userId} subscribed to ${channel}`);

    // Send initial code
    const latestCode = await redisPub.get(`latest:code:${data.watchId}`);
    if (latestCode) {
      safeSend(ws, { message: "REALTIME_CODE", data: latestCode });
    }

    // Send initial ALLOW_EDIT flag
    const allowEdit = await redisPub.get(`latest:allowEdit:${data.watchId}`);
    if (allowEdit === "true") {
      safeSend(ws, { message: "ALLOW_EDIT", data: true });
    }

    // Subscribe to updates on this channel
    await viewerRedisSub.subscribe(channel, (message) =>
      handleViewerRedisMessage(ws, message)
    );

    // Notify existing viewers
    const allViewers = await redisPub.hVals(`viewers:${data.watchId}`);
    const viewerList = allViewers.map((v) => JSON.parse(v));
    await redisPub.publish(
      channel,
      JSON.stringify({ message: "VIEWER_UPDATE", data: viewerList })
    );
  } catch (error) {
    console.error("Error in handleRegisterViewer:", error);
    ws.close(4500, "Internal Server Error");
  }
};

const safeSend = (ws: customWebSocket, payload: any) => {
  try {
    ws.send(JSON.stringify(payload));
  } catch (err) {
    console.error("WebSocket send failed:", err);
  }
};

const handleViewerRedisMessage = (ws: customWebSocket, rawMessage: string) => {
  try {
    const data = JSON.parse(rawMessage);
    const { message } = data;

    switch (message) {
      case "REALTIME_CODE":
        if (data.data.by !== ws.userId) {
          safeSend(ws, {
            message: "REALTIME_CODE",
            data: data.data.code,
          });
        }
        break;

      case "SHARING_STOPPED":
        ws.redisSub?.unsubscribe();
        ws.close(4000, "SHARING_STOPPED");
        break;

      case "VIEWER_UPDATE":
        safeSend(ws, {
          message: "VIEWER_UPDATE",
          data: data.data,
        });
        break;

      case "ALLOW_EDIT":
        safeSend(ws, {
          message: "ALLOW_EDIT",
          data: data.data,
        });
        break;

      default:
        console.warn("Unknown message type received vv:", message);
        break;
    }
  } catch (err) {
    console.error("Failed to process viewer message:", err);
  }
};
