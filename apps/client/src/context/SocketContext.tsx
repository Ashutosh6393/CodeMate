import { AuthContext } from "./AuthContext.tsx";
import { AppContext } from "./AppContext.tsx";
import React, {
  createContext,
  useEffect,
  useRef,
  useContext,
  useState,
} from "react";

import { useNavigate } from "react-router";
import { toast } from "sonner";

type message = {
  message: "code" | "output" | "user";
  data: string;
};

interface SocketContextType {
  sendMessage: (data: message) => void;
  socketRef: React.RefObject<WebSocket | null>;
}

const defaultValue: SocketContextType = {
  sendMessage: () => {},
  socketRef: { current: null },
};

export const SocketContext = createContext(defaultValue);

type Props = {
  children: React.ReactNode;
};

const SocketProvider: React.FC<Props> = ({ children }) => {
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const { sharing, watchId, monacoRef } = useContext(AppContext);
  const socketRef = useRef<WebSocket | null>(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const sendMessage = (data: message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }
  };

  const recieveMessage = (event: MessageEvent) => {
    monacoRef.current?.editor.getModels()[0]?.setValue(event.data);
  };

  useEffect(() => {
    if (sharing || watchId) {
      const socket = new WebSocket("ws://localhost:8080");
      socket.onopen = () => {
        setIsSocketConnected(true);
        socketRef.current = socket;
        console.log("Connected to socket server");

        if (sharing) {
          socket.send(
            JSON.stringify({ message: "REGISTER_SHARER", data: user?.userId })
          );
        }
        socket.addEventListener("message", recieveMessage);
      };

      socket.onerror = (error) => {
        setIsSocketConnected(false);
        console.log("Error connecting to socket server", error);
      };

      socket.onclose = (event) => {
        if (event.code === 1007 && event.reason === "Invalid Watch Id") {
          navigate("/codespace", { replace: true });
          toast.message("Codespace not found.");
        } else if (event.code === 1000 && event.reason === "Sharing Stopped") {
          navigate("/codespace", { replace: true });
          toast.message("Sharing stopped by Sharer.");
        }
        setIsSocketConnected(false);
        console.log("Disconnected from socket server");
      };
    } else {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    }

    return () => {
      socketRef.current?.removeEventListener("message", () => {});
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setIsSocketConnected(false);
    };
  }, [sharing, watchId]);

  useEffect(() => {
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN &&
      watchId
    ) {
      socketRef.current.send(
        JSON.stringify({
          message: "REGISTER_VIEWER",
          data: { userId: user?.userId, watchId },
        })
      );
    }
  }, [watchId, isSocketConnected]);

  return (
    <SocketContext.Provider value={{ sendMessage, socketRef }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
