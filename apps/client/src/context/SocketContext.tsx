import React, { createContext } from "react";
import { useSocket } from "../hooks/useSocket";
import { MessagePayload } from "../lib/messagePayloads.ts";

type Props = {
  children: React.ReactNode;
};

export type SocketContextType = {
  sendMessage: (data: MessagePayload) => void;
  socketRef: React.RefObject<WebSocket | null>;
  isRemoteUpdateRef: React.RefObject<boolean>;
};

const defaultValue: SocketContextType = {
  sendMessage: () => {},
  socketRef: { current: null },
  isRemoteUpdateRef: { current: false },
};

export const SocketContext = createContext(defaultValue);

const SocketProvider: React.FC<Props> = ({ children }) => {
  const { sendMessage, socketRef, isRemoteUpdateRef } = useSocket();
  return (
    <SocketContext.Provider
      value={{ sendMessage, socketRef, isRemoteUpdateRef }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
