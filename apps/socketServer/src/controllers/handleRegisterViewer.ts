import { WebSocket } from "ws";
import { redisPub, redisSub } from "../index.js";

interface customWebSocket extends WebSocket {
  userId: string;
  userName: string;
  watchId?: string;
}

const getCodeChannel = (id: string) => `code:${id}`;

export const handleRegisterViewer = async (
  ws: customWebSocket,
  data: { userId: string; userName: string; watchId: string }
) => {
  ws.userId = data.userId;
  ws.watchId = data.watchId;
  ws.userName = data.userName;

  const channelExists = await redisPub.exists(`latest:code:${ws.watchId}`);
  if (!channelExists) {
    ws.close(4000, "INVALID_WATCH_ID");
  }

  const channel = getCodeChannel(ws.watchId);

  // updating viewers count
  await redisPub.hSet(
    `viewers:${ws.watchId}`,
    data.userId,
    JSON.stringify({ userId: data.userId, username: data.userName })
  );

  const allViewers = await redisPub.hVals(`viewers:${ws.watchId}`);
  const viewerList = allViewers.map((v) => JSON.parse(v));

  // console.log("new viewer list", viewerList);
  // sending initial code

  const latestCode = await redisPub.get(`latest:code:${ws.watchId}`);
  if (latestCode) {
    try {
      ws.send(JSON.stringify({ message: "REALTIME_CODE", data: latestCode }));
    } catch (err) {
      console.error("Error sending initial code to viewer", err);
    }
  }

  await redisSub.subscribe(channel, (message) => {
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
          redisSub.unsubscribe(channel);
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
