import React from "react";
import { Sidebar } from "../components/index";
import { useLocation } from "react-router-dom";
import { Editor } from "../components/index";
function Room() {
  const location = useLocation();
  const user = location.state.username;
  return (
    <div className="w-full h-screen bg-bg-0 flex w-">
      <Sidebar name={user} width="w-2/12" />
      <Editor width="w-8/12" />
    </div>
  );
}

export default Room;
