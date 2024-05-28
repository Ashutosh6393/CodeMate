import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Logo, Button, Client } from "../index";
import {toast} from "react-hot-toast"

function Sidebar({ users }) {
  const {roomId} = useParams()
  const navigate = useNavigate();

  const handleCopyRoomId = ()=>{
    navigator.clipboard.writeText(roomId)
    toast.success("Room ID copied to clipboard")

    
  }

  const handleLeaveRoom = () => {
    navigate("/");
  };
  return (
    <div
      className={`h-full w-full flex flex-col items-center gap-4 bg-bg-1 pt-4`}
    >
      <div className="h-20 p-5 px-10 w-full">
        <Logo />
      </div>
      <div className="w-full flex-grow flex items-start justify-center px-10 pt-6 overflow-scroll overflow-x-hidden roomMates">
        <div className="flex justify-start flex-wrap gap-8">
          {
            // console.log(members)
            users.map((member) => (
              <Client key={member.socketId} username={member.username} />
            ))
          }
         
      
        </div>
      </div>
      <div className="p-5 w-full flex flex-col gap-2 ">
        <Button handlerFunction={handleCopyRoomId}textColor="text-white-0" bgColor="bg-gray" className="w-full">
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
