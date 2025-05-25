import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { socketUrl } from "../../envConfig.ts";
import { MessagePayload } from "../lib/messagePayloads.ts";

export const useSocket = () => {
  const {
    sharing,
    watchId,
    monacoRef,
    setWatchId,
    codeRef,
    language,
    isMonacoReady,
    pendingCodeRef,
    setAllowEdit,
    setViewers,
    setLanguage,
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

      case "LANGUAGE_UPDATE":
        setLanguage(data);
    }
  };

  const handleSocketOpen = (socket: WebSocket) => {
    setIsConnected(true);
    socketRef.current = socket;

    if (sharing) {
      sendMessage({
        message: "REGISTER_SHARER",
        data: {
          userId: user!.userId,
          userName: user!.name,
          initialCode: codeRef.current,
          languageSelected: language,
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

  useEffect(() => {
    sendMessage({
      message: "LANGUAGE_UPDATE",
      data: language,
    });
  }, [language]);

  return {
    sendMessage,
    socketRef,
    isRemoteUpdateRef,
  };
};
