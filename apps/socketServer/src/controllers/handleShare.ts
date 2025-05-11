import { redisPub, customWebSocket } from "../index.js";
const getCodeChannel = (id: string) => `code:${id}`;

export const handleLiveShare = (ws: customWebSocket, code: string) => {
  const channel = getCodeChannel(ws.userId);
  redisPub.publish(channel, JSON.stringify({ message: "REALTIME_CODE", data: code })); 
  redisPub.set(`latest:code:${ws.userId}`, code);
};
