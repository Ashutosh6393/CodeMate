import React from "react";

function RoomMate({ name }) {
  function shortName() {
    const initials = name.toUpperCase().split(" ")
    let short = "";
    initials.forEach((element) => {
      short += element[0];
    });
    return short;
  }

  
  return (
    <div className="w-20 h-fit place-items-start">
      <div className="w-20 h-20 rounded-full mb-1 flex justify-center items-center text-2xl bg-primary">{shortName()}</div>
      <p className="text-white-0 text-sm text-center">{name}</p>
    </div>
  );
}

export default RoomMate;
