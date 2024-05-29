import React from "react";
import Avatar from "react-avatar";
function Client({username, handleAvatarClick, socketId}) {
  return (
    <div
      onClick={()=>{handleAvatarClick(socketId);}}
      className="flex flex-col w-min justify-center items-center self-start"
    >
      <Avatar size="90" round={true} name={username} />
      <p className="text-white-0 w-full text-center text-wrap">{username}</p>
    </div>
  );
}

export default Client;
