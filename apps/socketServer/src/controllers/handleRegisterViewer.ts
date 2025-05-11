import { redisPub, customWebSocket } from "../index.js";
import { getCodeChannel } from "../utils/index.js";
import { createClient } from "redis";

const redisConfig = {
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
};

export const handleRegisterViewer = async (
  ws: customWebSocket,
  data: { userId: string; userName: string; watchId: string }
) => {
  ws.userId = data.userId;
  ws.watchId = data.watchId;
  ws.userName = data.userName;

  const exists = await redisPub.exists(`latest:code:${ws.watchId}`);
  if (!exists) {
    return ws.close(4000, "INVALID_WATCH_ID");
  }

  const viewerRedisSub = createClient(redisConfig);
  await viewerRedisSub.connect();
  ws.redisSub = viewerRedisSub;

  const channel = getCodeChannel(ws.watchId);

  // updating viewers count
  await redisPub.hSet(
    `viewers:${ws.watchId}`,
    data.userId,
    JSON.stringify({ userId: data.userId, username: data.userName })
  );

  const allViewers = await redisPub.hVals(`viewers:${ws.watchId}`);
  const viewerList = allViewers.map((v) => JSON.parse(v));

  const latestCode = await redisPub.get(`latest:code:${ws.watchId}`);
  if (latestCode) {
    try {
      ws.send(JSON.stringify({ message: "REALTIME_CODE", data: latestCode }));
    } catch (err) {
      console.error("Error sending initial code to viewer", err);
    }
  }

  await viewerRedisSub.subscribe(channel, (message) => {
    const data = JSON.parse(message);
    try {
      switch (data.message) {
        //sending code as sharer types
        case "REALTIME_CODE":
          ws.send(
            JSON.stringify({ message: "REALTIME_CODE", data: data.data })
          );
          break;

        //when sharer disconnects
        case "SHARING_STOPPED":
          viewerRedisSub.unsubscribe(channel);
          ws.close(4000, "SHARING_STOPPED");
          break;

        //when new viewer joins
        case "VIEWER_UPDATE":
          // console.log("viewer subs update", data.data);
          ws.send(
            JSON.stringify({ message: "VIEWER_UPDATE", data: data.data })
          );
          break;

        default:
          break;
      }
    } catch (err) {
      console.error("Error sending code to watcher:", err);
    }
  });

  await redisPub.publish(
    channel,
    JSON.stringify({ message: "VIEWER_UPDATE", data: viewerList })
  );

  console.log(`Viewer ${ws.userId} subscribed to ${channel}`);
};
