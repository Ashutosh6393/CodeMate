import { EVENTS } from "../events";
import { toast } from "react-hot-toast";
import React, { useEffect, useRef } from "react";
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
  const { setMyInfo, setMembers, socketRef, editorRef } = useAppContext();
  const menuRef = useRef(null);

  let username;
  if (location.state?.username) {
    username = location.state.username;
  } else {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    const init = async () => {
      try {
        const socket = await connectToServer();
        socketRef.current = socket;

        setMyInfo({ username: username, socketId: socket.id });

        socket.emit(EVENTS.JOIN, { roomId, username }, (data) => {
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
          socket.emit(
            EVENTS.SEND_CODE_TO_SUBSCRIBERS,
            editorRef.current.getValue()
          );
          const data = { code: editorRef.current.getValue() };
        });

        socket.on(EVENTS.SUBSCRIBED_CODE, (data) => {
          if (data.sender !== socket.id) {
            editorRef.current.setValue(data.data);
          }
        });

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

  return (
    <div className="w-full h-auto bg-bg-0 flex flex-col xl:flex-row xl:h-screen relative">
      <div ref={menuRef} className="w-[80%] transition h-full absolute left-[-100%] hidden xl:block xl:static xl:w-[20%] xl:h-screen z-50">
        {socketRef && <Sidebar />}
      </div>
      <div className="editor h-screen w-full xl:wd-[80%] xl:h-full z-20" >
        {socketRef && <Editor menu={menuRef}/>}
      </div>
    </div>
  );
}

export default Room;
