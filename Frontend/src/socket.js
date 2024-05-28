import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    forceNew: true,
    transports : ['websocket'],
    timeout: 10000,
    
  };

  return io(import.meta.env.VITE_APP_BACKEND_URL, options);
};
