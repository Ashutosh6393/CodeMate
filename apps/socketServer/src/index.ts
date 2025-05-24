import { handleConnection } from "./controllers/handleConnection.js";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import { redisConfig } from "./utils/redisConfig.js";
import { RedisClientType, createClient } from "redis";

dotenv.config();

export const redisPub: RedisClientType = createClient(redisConfig);
redisPub.on("error", (err) => {
  console.error("Redis Pub Client Error:", err);
});

const startServer = async () => {
  try {
    await redisPub.connect(); // Connect ONCE here

    const wss = new WebSocketServer({ port: 8080 }, () => {
      console.log("WebSocket server started on port 8080");
    });

    wss.on("connection", handleConnection);

    process.on("SIGINT", async () => {
      console.log("Shutting down WebSocket server...");
      await redisPub.quit();
      wss.close(() => {
        console.log("WebSocket server closed");
        process.exit(0);
      });
    });
  } catch (err) {
    console.error("Failed to start WebSocket server:", err);
    process.exit(1);
  }
};

startServer();
