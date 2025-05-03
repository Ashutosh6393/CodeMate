import { AuthContext } from "./AuthContext.tsx";
import { AppContext } from "./AppContext.tsx";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import React, {
  createContext,
  useEffect,
  useRef,
  useContext,
  useState,
} from "react";

type message = {
  message: "REALTIME_CODE" | "output" | "user";
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
  const {
    sharing,
    watchId,
    monacoRef,
    setWatchId,
    codeRef,
    isMonacoReady,
    pendingCodeRef,
  } = useContext(AppContext);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const sendMessage = (data: message) => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify(data));
    }
  };

  const recieveMessage = (event: MessageEvent) => {
    const { message, data } = JSON.parse(event.data);
    if (message === "CODE") {
      if (isMonacoReady) {
        monacoRef.current?.editor.getModels()[0]?.setValue(data);
      } else {
        pendingCodeRef.current = data;
      }
      monacoRef.current?.editor.getModels()[0]?.setValue(data);
    }
  };

  const handleSocketConnection = (socket: WebSocket) => {
    setIsSocketConnected(true);
    socketRef.current = socket;
    console.log("Connected to socket server");

    if (sharing) {
      socket.send(
        JSON.stringify({
          message: "REGISTER_SHARER",
          data: { userId: user?.userId, initialCode: codeRef.current },
        })
      );
    }
    socket.addEventListener("message", recieveMessage);
  };

  const handleSocketError = (error: Event) => {
    setIsSocketConnected(false);
    console.log("Error connecting to socket server", error);
  };

  const handleSocketClose = (event: CloseEvent) => {
    switch (event.reason) {
      case "INVALID_WATCH_ID":
        navigate("/codespace", { replace: true });
        setWatchId(null);
        toast.message("Watch Id seem to be invalid.");
        break;

      case "SHARING_STOPPED":
        toast.message("Sharing stopped by Sharer.");
        navigate("/codespace", { replace: true });
        setWatchId(null);
        monacoRef.current?.editor.getModels()[0]?.setValue("");
        break;

      default:
        break;
    }
    setIsSocketConnected(false);
    console.log("Disconnected from socket server");
  };

  useEffect(() => {
    if (sharing || watchId) {
      const socket = new WebSocket("ws://localhost:8080");

      socket.onopen = () => {
        handleSocketConnection(socket);
      };

      socket.onerror = (error) => {
        handleSocketError(error);
      };

      socket.onclose = (event) => {
        handleSocketClose(event);
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
    if (socketRef.current && watchId) {
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
