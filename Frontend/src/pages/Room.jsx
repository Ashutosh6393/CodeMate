import React from "react";
import { Sidebar, Editor } from "../components/index";
import { useLocation } from "react-router-dom";
function Room() {
  const location = useLocation();
  const user = location.state.username;
  return (
    <div className="w-full h-screen bg-bg-0 flex">
      <div className="sidebar w-[20%]">
        <Sidebar name={user} />
      </div>
      <div className="editor h-full w-[80%]">
        <Editor/>
      </div>
    </div>
  );
}

export default Room;
