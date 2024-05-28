import React from "react";
import { Monaco, RightSidebar } from "../index";

function Editor({socket}) {
  return (
    <div className={"flex h-full"}>
      <div className="monaco border-2 w-3/4 h-full flex flex-col ">
        <p className="text-white-0 h-10 text-xl text-center font-semibold py-2 bg-bg-1">
          Your CodeSpace
        </p>
        <div className="flex-grow">
          <Monaco socket={socket} />
        </div>
      </div>
      <div className="rightSidebar w-1/4 h-full">
        <RightSidebar />
      </div>
    </div>
  );
}

export default Editor;
