import { handleConnection } from "./controllers/handleConnection.js";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
dotenv.config();

const wss = new WebSocketServer({ port: 8080 }, () => {
  console.log("WebSocket server started on port 8080");
});
wss.on("connection", handleConnection);
