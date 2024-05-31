import React from "react";
import { Button } from "../index";
import { Monaco, RightSidebar } from "../index";
import { useAppContext } from "../../context/appContext";
import { EVENTS } from "../../events";

function Editor() {
  const {
    watchingOther,
    setCode,
    setWatchingOther,
    setCurrentlyWatching,
    currentlyWatching,
    socketRef,
  } = useAppContext();


  const handleBackToMyCodespace = () => {
    socketRef.current.emit(EVENTS.LEAVE_CODESPACE, { currentlyWatching });
    setCurrentlyWatching(null);
    setWatchingOther(false);
    setCode("");
  };
  return (
    <div className={"flex h-full"}>
      <div className="monaco border-2 w-3/4 h-full flex flex-col ">
        <div className="bg-bg-1 h-10 relative ">
          <p className="text-white-0 flex-grow text-xl text-center font-semibold py-2 ">
            Your CodeSpace
          </p>
          {watchingOther && (
            <Button
              width="w-52"
              className="absolute right-0 h-full top-0 text-sm p-1 rounded font-semibold"
              textColor="text-white-0"
              bgColor="bg-gray"
              handlerFunction={handleBackToMyCodespace}
            >
              Back to my codespace
            </Button>
          )}
        </div>
        <div className="flex-grow">
          <Monaco />
        </div>
      </div>
      <div className="rightSidebar w-1/4 h-full">
        <RightSidebar />
      </div>
    </div>
  );
}

export default Editor;
