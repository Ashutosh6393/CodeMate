import { createClient } from "redis";
import { WebSocket } from "ws";

export interface customWebSocket extends WebSocket {
  userId: string;
  userName: string;
  redisSub: ReturnType<typeof createClient>;
  watchId?: string;
  allowEdit?: boolean;
}
