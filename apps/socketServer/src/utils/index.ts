import { redisPub } from "../controllers/handleConnection.js";

export const getCodeChannel = (id: string) => `code:${id}`;

export const checkIfCodeChannelExists = async (id: string) => {
  const channels = await redisPub.pubSubChannels(`code:${id}`);
  return channels.includes(`code:${id}`);
};
