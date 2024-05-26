import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    "force new connection": true,
    transports: ["websocket"],
    reconnectionAttempt: "Infinity",
    timeout: 10000,
  };

  return io(meta.env.VITE_APP_BACKENT_URL, options)

};
