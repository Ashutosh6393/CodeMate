import React, { createContext } from "react";
import { useSocket } from "../hooks/useSocket";

type Props = {
  children: React.ReactNode;
};

type MessagePayload =
  | { message: "REALTIME_CODE"; data: string }
  | { message: "ALLOW_EDIT"; data: boolean }
  | {
      message: "REGISTER_SHARER";
      data: { userId: string; userName: string; initialCode: string };
    }
  | {
      message: "REGISTER_VIEWER";
      data: { userId: string; userName: string; watchId: string };
    }
  | { message: string; data: string };

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
