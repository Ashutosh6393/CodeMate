import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { socketUrl } from "../../envConfig.ts";

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

export const useSocket = () => {
  const {
    sharing,
    watchId,
    monacoRef,
    setWatchId,
    codeRef,
    isMonacoReady,
    pendingCodeRef,
    setAllowEdit,
    setViewers,
    setEditorDisabled,
  } = useContext(AppContext);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const { user } = useContext(AuthContext);
  const isRemoteUpdateRef = useRef(false);
  const navigate = useNavigate();

  const sendMessage = (data: MessagePayload) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }
  };

  const handleMessage = (event: MessageEvent) => {
    const { message, data } = JSON.parse(event.data);

    switch (message) {
      case "REALTIME_CODE":
        if (isMonacoReady) {
          isRemoteUpdateRef.current = true;
          monacoRef.current?.editor.getEditors()[0]?.setValue(data);
        } else {
          pendingCodeRef.current = data;
        }
        break;

      case "VIEWER_UPDATE":
        setViewers(data);
        break;

      case "ALLOW_EDIT":
        setEditorDisabled(!data);
        if (watchId) {
          setAllowEdit(data);
        }
        toast.message(data ? "Editing enabled by Sharer" : "Editing disabled");
        break;
    }
  };

  const handleSocketOpen = (socket: WebSocket) => {
    setIsConnected(true);
    socketRef.current = socket;
    // console.log("Socket connected");

    if (sharing) {
      sendMessage({
        message: "REGISTER_SHARER",
        data: {
          userId: user!.userId,
          userName: user!.name,
          initialCode: codeRef.current,
        },
      });
    }

    socket.addEventListener("message", handleMessage);
  };

  const handleSocketClose = (event: CloseEvent) => {
    switch (event.reason) {
      case "INVALID_WATCH_ID":
        navigate("/codespace", { replace: true });
        setWatchId(null);
        toast.message("Watch ID seems invalid.");
        break;

      case "SHARING_STOPPED":
        toast.message("Sharing stopped by Sharer.");
        monacoRef.current?.editor.getEditors()[0]?.setValue("");
        navigate("/codespace", { replace: true });
        setWatchId(null);
        setViewers([]);
        break;
    }

    setIsConnected(false);
    // console.log("Socket closed");
  };

  const handleSocketError = () => {
    setIsConnected(false);
  };

  useEffect(() => {
    if (sharing || watchId) {
      const socket = new WebSocket(socketUrl);
      socket.onopen = () => handleSocketOpen(socket);
      socket.onerror = handleSocketError;
      socket.onclose = handleSocketClose;
    } else {
      socketRef.current?.close();
      socketRef.current = null;
      setViewers([]);
      setIsConnected(false);
    }

    return () => {
      socketRef.current?.removeEventListener("message", handleMessage);
      socketRef.current?.close();
      socketRef.current = null;
      setViewers([]);
      setIsConnected(false);
    };
  }, [sharing, watchId]);

  useEffect(() => {
    if (socketRef.current && watchId) {
      sendMessage({
        message: "REGISTER_VIEWER",
        data: {
          userId: user!.userId,
          userName: user!.name,
          watchId,
        },
      });
    }
  }, [watchId, isConnected]);

  return {
    sendMessage,
    socketRef,
    isRemoteUpdateRef,
  };
};
