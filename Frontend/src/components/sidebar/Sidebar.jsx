import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Logo, Button, Client } from "../index";
import { toast } from "react-hot-toast";
import { useAppContext } from "../../context/appContext";
import { EVENTS } from "../../events";
function Sidebar({className}) {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const {
    members,
    setCode,
    socketRef,
    editorCurrentValue,
    watchingOther,
    setWatchingOther,
    currentlyWatching,
    setCurrentlyWatching,
  } = useAppContext();

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied to clipboard");
  };

  const handleAvatarClick = (socketId, username) => {
    
    socketRef.current.emit(EVENTS.LEAVE_CODESPACE, { currentlyWatching: currentlyWatching?.socketId });
    if (!watchingOther && editorCurrentValue) {
      setCode(editorCurrentValue.current);
      if (socketId !== socketRef.current.id) {
        setWatchingOther(true);
        toast(`Your are currently watching ${username}`, {
          position: "top-center",
          icon: "👽"
        })
        setCurrentlyWatching(() => ({socketId, username}));
        socketRef.current.emit(EVENTS.JOIN_CODESPACE, {
          userToWatch: socketId,
        });
      }
    }
  };

  const handleLeaveRoom = () => {
    navigate("/");
  };
  return (
    <div
      className={`h-[90vh] xl:h-full w-full flex flex-col items-center gap-4 bg-bg-1 pt-4 ${className}`}
    >
      <div className="w-[30vw] xl:h-20 xl:p-5 xl:px-10 xl:w-full">
        <Logo />
      </div>
      <div className="w-full flex-grow flex items-start justify-center px-10 pt-6 overflow-scroll overflow-x-hidden roomMates">
        <div className=" w-full flex justify-center flex-wrap gap-8">
          {members.map((member) => (
            <Client
              key={member.socketId}
              handleAvatarClick={handleAvatarClick}
              username={member.username}
              socketId={member.socketId}
            />
          ))}
        </div>
      </div>
      <div className="p-5 w-full flex flex-col gap-2 ">
        <Button
          handlerFunction={handleCopyRoomId}
          textColor="text-white-0"
          bgColor="bg-gray"
          className="w-full"
        >
          Copy Room ID
        </Button>
        <Button
          handlerFunction={handleLeaveRoom}
          textColor="text-white-0"
          bgColor="bg-red"
          className="w-full"
        >
          Leave Room
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
