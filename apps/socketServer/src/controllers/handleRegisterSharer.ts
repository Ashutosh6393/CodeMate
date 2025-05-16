import { redisPub, customWebSocket } from "../index.js";
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const getCodeChannel = (id: string) => `code:${id}`;

const redisConfig = {
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
};

export const handleRegisterSharer = async (
  ws: customWebSocket,
  data: { userId: string; userName: string; initialCode: string }
) => {
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

        case "REALTIME_CODE":
          if (ws.allowEdit && data.data.by !== ws.userId) {
            ws.send(
              JSON.stringify({ message: "REALTIME_CODE", data: data.data.code })
            );
          }
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
