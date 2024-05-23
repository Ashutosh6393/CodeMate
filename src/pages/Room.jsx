import React from "react";
import { Sidebar } from "../components/index";
import { useLocation } from "react-router-dom";
function Room() {
  const location = useLocation()
  const user = location.state.username;
  return (
    <div className="w-full h-screen bg-bg-0 flex">
      <Sidebar name={user}/>
    </div>
  );
}

export default Room;
