import { redisPub, customWebSocket } from "../index.js";
import { WebSocket } from "ws";

const getCodeChannel = (id: string) => `code:${id}`;

export const handleLiveShare = (ws: customWebSocket, code: string) => {
  const channel = getCodeChannel(ws.userId);
  redisPub.publish(channel, JSON.stringify({ message: "REALTIME_CODE", data: code })); // todo: publish message : isCode sent or channel close is sent
  redisPub.set(`latest:code:${ws.userId}`, code);
};
