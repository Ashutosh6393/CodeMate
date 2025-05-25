import { customWebSocket } from "../utils/customWebSocket.js";
import { getCodeChannel } from "../utils/index.js";
import { redisPub } from "../index.js";

export const handleLanguageUpdate = (ws: customWebSocket, data: object) => {
  const channel = getCodeChannel(ws.userId);
  redisPub.publish(
    channel,
    JSON.stringify({ message: "LANGUAGE_UPDATE", data }),
  );
  redisPub.set(`latest:language:${ws.userId}`, JSON.stringify(data));
};
