import { redisPub, customWebSocket } from "../index.js";
const getCodeChannel = (id: string) => `code:${id}`;

export const handleLiveShare = (ws: customWebSocket, code: string) => {
  if (!ws.watchId) {
    const channel = getCodeChannel(ws.userId);
    redisPub.publish(
      channel,
      JSON.stringify({ message: "REALTIME_CODE", data: {by: ws.userId, code} })
    );
    redisPub.set(`latest:code:${ws.userId}`, code);
  } else if (ws.watchId) {
    const channel = getCodeChannel(ws.watchId);
    redisPub.publish(
      channel,
      JSON.stringify({ message: "REALTIME_CODE", data: {by: ws.userId, code} })
    );
    redisPub.set(`latest:code:${ws.watchId}`, code);
  }
};
