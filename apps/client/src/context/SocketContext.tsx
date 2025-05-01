import React, { createContext, useEffect, useRef, useContext } from "react";
import { SettingContext } from "./SettingContext.tsx";
import { AuthContext } from "./AuthContext.tsx";

type message = {
  message: "code" | "output" | "user";
  data: string;
};

interface SocketContextType {
  sendMessage: (data: message) => void;
}

const defaultValue: SocketContextType = {
  sendMessage: () => {},
};

export const SocketContext = createContext(defaultValue);

type Props = {
  children: React.ReactNode;
};

const SocketProvider: React.FC<Props> = ({ children }) => {
  const { sharing } = useContext(SettingContext);
  const { user } = useContext(AuthContext);

  const socketRef = useRef<WebSocket | null>(null);

  const sendMessage = (data: message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }
  };

  useEffect(() => {
    if (sharing) {
      const socket = new WebSocket("ws://localhost:8080");
      socketRef.current = socket;

      socket.onopen = () => {
        socket.send(JSON.stringify({ message: "user", data: user?.userId }));
        console.log("connected to socket server");
      };

      socket.onerror = (error) => {
        console.log("Error connecting to socket server", error);
      };

      socket.onclose = () => {
        console.log("Disconnected from socket server");
      };
    } else {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [sharing]);

  return (
    <SocketContext.Provider value={{ sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
