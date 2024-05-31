import { EVENTS } from "../events";
import { toast } from "react-hot-toast";
import React, { useEffect } from "react";
import connectToServer from "../socket.js";
import { Sidebar, Editor } from "../components/index";
import { useAppContext } from "../context/appContext.js";
import {
  useLocation,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";

function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const reactNavigator = useNavigate();
  const username = location.state.username;
  const {
    setMyInfo,
    setMembers,
    socketRef,
    editorCurrentValue,
    editorRef,
    watchingOther,
    code,
  } = useAppContext();

  useEffect(() => {
    const init = async () => {
      try {
        const socket = await connectToServer();
        socketRef.current = socket;

        setMyInfo({ username: username, socketId: socket.id });

        socket.emit(EVENTS.JOIN, { roomId, username }, (data) => {
          console.log(data);
          toast.success("Room joined successfully");
        });

        socket.on(EVENTS.ROOM_MEMBERS, (data) => {
          setMembers(data);
        });

        socket.on(EVENTS.NEW_MEMBER, (data) => {
          if (data.socketId !== socket.id) {
            toast.success(data.username + " joined the room!");
          }
        });

        socket.on(EVENTS.GET_CODE, () => {
          if (watchingOther) {
            socket.emit(EVENTS.SEND_CODE_TO_SUBSCRIBERS, code);
          }
        });

        socket.on(EVENTS.SUBSCRIBED_CODE, (data) => {
          if (data.sender !== socket.id) {
            console.log("code of the subscriber ", data.data);
          }
        });

        // recieve code from event events.codechange

        socket.on(EVENTS.LEAVE, (data) => {
          if (data.socketId !== socket.id) {
            toast.error(data.username + " left the room!");
          }
        });
      } catch (error) {
        toast.error(error.message);
        reactNavigator("/");
      }
    };
    init();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  if (!username) {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-full h-screen bg-bg-0 flex">
      <div className="sidebar w-[20%]">{socketRef && <Sidebar />}</div>
      <div className="editor h-full w-[80%]">{socketRef && <Editor />}</div>
    </div>
  );
}

export default Room;
