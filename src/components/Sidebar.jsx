import React from "react";
import { useNavigate } from "react-router-dom";
import { Logo, RoomMate, Button } from "./index";

function Sidebar({ name }) {
    const navigate = useNavigate();
    const handleLeaveRoom = () => {
      navigate('/')
    };
  return (
    <div className="h-screen w-72 flex flex-col items-center gap-4 bg-bg-1 pt-4">
      <div className="h-[5%]">
        <Logo width="w-48" ></Logo>
      </div>
      <div className="h-[92%] flex flex-col justify-between w-full">
        <div className="w-full border-t-2 flex items-start justify-start flex-wrap gap-8 h-[70%] p-3 px-8 pt-6 overflow-scroll overflow-x-hidden roomMates">
          <RoomMate name={name} />

        </div>
        <div className="p-5 w-full flex flex-col gap-2 h-[20%]">
          <Button textColor="text-white-0" bgColor="bg-gray" className="w-full">
            Copy Room ID
          </Button>
          <Button handlerFunction={handleLeaveRoom} textColor="text-white-0" bgColor="bg-red" className="w-full">
            Leave Room
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
