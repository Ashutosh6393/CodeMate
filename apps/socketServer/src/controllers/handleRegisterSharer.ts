import { customWebSocket } from "../utils/customWebSocket.js";
import { redisConfig } from "../utils/redisConfig.js";
import { getCodeChannel } from "../utils/index.js";
import { redisPub } from "./handleConnection.js";
import { createClient } from "redis";

export const handleRegisterSharer = async (
  ws: customWebSocket,
  data: { userId: string; userName: string; initialCode: string },
) => {
  try {
    ws.userId = data.userId;
    ws.userName = data.userName;

    console.log(`Sharer ${data.userId} connected`);

    const channel = getCodeChannel(ws.userId);
    await redisPub.set(`latest:code:${ws.userId}`, data.initialCode);
    const sharerRedisSub = createClient(redisConfig);
    sharerRedisSub.on("error", (err) => console.error("Redis sub Error", err));
    await sharerRedisSub.connect();
    ws.redisSub = sharerRedisSub;

    await sharerRedisSub.subscribe(channel, (message) => {
      try {
        const parsed = JSON.parse(message);
        switch (parsed.message) {
          case "VIEWER_UPDATE":
            ws.send(
              JSON.stringify({
                message: "VIEWER_UPDATE",
                data: parsed.data,
              }),
            );
            break;

          case "REALTIME_CODE":
            if (ws.allowEdit && parsed.data.by !== ws.userId) {
              ws.send(
                JSON.stringify({
                  message: "REALTIME_CODE",
                  data: parsed.data.code,
                }),
              );
            }
            break;

          default:
            console.warn(`Unhandled message typec ss: ${parsed.message}`);
            break;
        }
      } catch (err) {
        console.error("Error parsing Redis message:", err);
      }
    });

    await redisPub.publish(
      channel,
      JSON.stringify({
        message: "REALTIME_CODE",
        data: data.initialCode,
      }),
    );
  } catch (err) {
    console.error("Error in handleRegisterSharer:", err);
    ws.close(4501, "Internal Server Error");
  }
};
