import { redisPub, customWebSocket } from "../index.js";
const getCodeChannel = (id: string) => `code:${id}`;

export const handleAllowEdit = (ws: customWebSocket, data: boolean) => {
  ws.allowEdit = data;
  const channel = getCodeChannel(ws.userId);
  redisPub.publish(channel, JSON.stringify({ message: "ALLOW_EDIT", data }));
//   console.log("allow edit event recieved and published it", data);
};
