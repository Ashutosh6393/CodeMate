import { customWebSocket } from "../utils/customWebSocket.js";
import { getCodeChannel } from "../utils/index.js";
import { redisPub } from "./handleConnection.js";

export const handleAllowEdit = (ws: customWebSocket, data: boolean) => {
  ws.allowEdit = data;
  const channel = getCodeChannel(ws.userId);
  redisPub.publish(channel, JSON.stringify({ message: "ALLOW_EDIT", data }));
  redisPub.set(`latest:allowEdit:${ws.userId}`, data == true ? 1 : 0);
};
