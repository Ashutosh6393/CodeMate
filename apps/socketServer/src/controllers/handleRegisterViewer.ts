import { WebSocket } from "ws";
import { redisPub, redisSub } from "../index.js";

interface customWebSocket extends WebSocket {
  userId: string;
  watchId?: string;
}

const getCodeChannel = (id: string) => `code:${id}`;

const checkIfCodeChannelExists = async (id: string) => {
  const channels = await redisPub.pubSubChannels(`code:${id}`);
  console.log("channels: ", channels)
  return channels.includes(`code:${id}`);
};

export const handleRegisterViewer = async (
  ws: customWebSocket,
  data: { userId: string; watchId: string }
) => {
  ws.userId = data.userId;
  ws.watchId = data.watchId;

  const channelExists = await redisPub.exists(`latest:code:${ws.watchId}`);
  if (!channelExists) {
    ws.close(4000, "INVALID_WATCH_ID");
  }

  const channel = getCodeChannel(ws.watchId);

  const latestCode = await redisPub.get(`latest:code:${ws.watchId}`);
  if (latestCode) {
    try {
      ws.send(JSON.stringify({ message: "CODE", data: latestCode })); // todo: send code in proper format
    } catch (err) {
      console.error("Error sending initial code to viewer", err);
    }
  }

  await redisSub.subscribe(channel, (message) => {
    const data = JSON.parse(message);
    try {
      if (data.message === "CODE") {
        ws.send(JSON.stringify({ message: "CODE", data: data.data }));
      } else if (data.message === "CLOSE") {
        redisSub.unsubscribe(channel);
        ws.close(4000, "SHARING_STOPPED");
      }
      //todo: check message type then send or close
      // todo: send code in proper format
    } catch (err) {
      console.error("Error sending code to watcher:", err);
    }
  });

  console.log(`Viewer ${ws.userId} subscribed to ${channel}`);
};
