import React from "react";
import { useNavigate } from "react-router-dom";
import { Logo, Button, Client } from "../index";

function Sidebar({ name }) {
  const navigate = useNavigate();
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
          <Client username="Rame  H" />
      
        </div>
      </div>
      <div className="p-5 w-full flex flex-col gap-2 ">
        <Button textColor="text-white-0" bgColor="bg-gray" className="w-full">
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
