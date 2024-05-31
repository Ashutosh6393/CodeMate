import { io } from "socket.io-client";

const options = {
  forceNew: true,
  transports: ["websocket"],
  timeout: 10000,
};

const connectToServer = () => {
  return new Promise((resolve, reject) => {
    const socket = io(import.meta.env.VITE_APP_BACKEND_URL, options);
    socket.on("connect", () => {
      resolve(socket);
    });
    socket.on("connect_error", () => {
      reject(new Error("Could not connect to server"));      
    });
  });
};

export default connectToServer;






// export const initSocket = async () => {
//   const options = {
//     forceNew: true,
//     transports : ['websocket'],
//     timeout: 10000,

//   };

//   return io(import.meta.env.VITE_APP_BACKEND_URL, options);
// };
