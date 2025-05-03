import { handleConnection } from "./controllers/handleConnection.js";
import { WebSocketServer, WebSocket } from "ws";
import { RedisClientType } from "redis";
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const redisConfig = {
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
};

const redisPub: RedisClientType = createClient(redisConfig);
const redisSub: RedisClientType = createClient(redisConfig);

redisPub.on("error", (err) => console.error("Redis Pub Error", err));
redisSub.on("error", (err) => console.error("Redis Sub Error", err));

await redisPub.connect();
await redisSub.connect();

const wss = new WebSocketServer({ port: 8080 }, () => {
  console.log("WebSocket server started on port 8080");
});

wss.on("connection", handleConnection);

export { redisPub, redisSub };
