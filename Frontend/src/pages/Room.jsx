import { EVENTS } from "../events";
import { initSocket } from "../socket";
import { toast } from "react-hot-toast";
import { Sidebar, Editor } from "../components/index";
import { useAppContext } from "../context/appContext.js";
import React, { useState, useEffect, useRef } from "react";
import {
  useLocation,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";

function Room() {
  // const codeValueRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  // const socket = useRef(null);

  const {
    socket,
    members,
    setMyInfo,
    setMembers,
    codeValueRef,
    watchingOther,
  } = useAppContext();
  const { roomId } = useParams();

  const username = location.state.username;
  // const [members, setMembers] = useState([]);

  function handleError(e) {
    console.log("socket error", e);
    toast.error("Socket connection failed, try again later.");
    reactNavigator("/");
  }

  useEffect(() => {
    const init = async () => {
      socket.current = await initSocket();
      socket.current.on("connect", () => {
        setMyInfo(() => ({ username: username, socketId: socket.current.id }));
        console.log(socket.current.id);
        toast.success("Room joined successfully");
      });

      socket.current.on("connect_error", (e) => handleError(e));
      socket.current.on("connect_failed", (e) => handleError(e));
      socket.current.emit(EVENTS.JOIN, {
        roomId,
        username,
      });

      socket.current.on(EVENTS.ROOM_MEMBERS, (data) => {
        setMembers(data);
      });

      socket.current.on(EVENTS.NEW_MEMBER, (data) => {
        if (data.socketId !== socket.current.id) {
          toast.success(data.username + " joined the room!");
        }
      });

      socket.current.on(EVENTS.LEAVE, (data) => {
        if (data.socketId !== socket.current.id) {
          toast.error(data.username + " left the room!");
        }
      });
    };

    init();

    return () => {
      socket.current.disconnect();
    };
  }, []);

  if (!username) {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-full h-screen bg-bg-0 flex">
      <div className="sidebar w-[20%]">
        <Sidebar />
      </div>
      <div className="editor h-full w-[80%]">
        <Editor />
      </div>
    </div>
  );
}

export default Room;
