import { customWebSocket } from "../utils/customWebSocket.js";
import { redisPub } from "./handleConnection.js";
import { getCodeChannel } from "../utils/index.js";

export const handleLiveShare = async (ws: customWebSocket, code: string) => {
  try {
    const targetId = ws.watchId || ws.userId;
    const channel = getCodeChannel(targetId);

    const payload = {
      message: "REALTIME_CODE",
      data: { by: ws.userId, code },
    };

    await Promise.all([
      redisPub.publish(channel, JSON.stringify(payload)),
      redisPub.set(`latest:code:${targetId}`, code),
    ]);

    console.log(`[LIVE_SHARE] ${ws.userId} -> ${targetId}: code updated`);
  } catch (err) {
    console.error("Error in handleLiveShare:", err);
    ws.close(4500, "Internal Server Error during live share");
  }
};
