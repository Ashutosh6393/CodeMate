import React from "react";
import { Button } from "../index";
import { Monaco, RightSidebar } from "../index";
import { useAppContext } from "../../context/appContext";
import { EVENTS } from "../../events";
import { toast } from "react-hot-toast";

function Editor() {
  const {
    watchingOther,
    code,
    setCode,
    setWatchingOther,
    setCurrentlyWatching,
    currentlyWatching,
    editorRef,
    socketRef,
  } = useAppContext();


  const handleBackToMyCodespace = () => {
    socketRef.current.emit(EVENTS.LEAVE_CODESPACE, { currentlyWatching: currentlyWatching?.socketId });
    setCurrentlyWatching(null);
    setWatchingOther(false);
    editorRef.current.setValue(code);
    setCode("");
    toast("You are back to your codespace", {
      position: "top-center",
      icon: "✌️"
    })
  };
  return (
    <div className={"flex h-fit flex-col"}>
      <div className="border-2 w-full h-[70vh] flex flex-col ">
        <div className="bg-bg-1 h-[5%] relative flex justify-center items-center">
          <p className="text-white-0 flex- text-xl text-center font-semibold py-2 ">
            {currentlyWatching !== null ? `${currentlyWatching?.username}'s` : "Your"} codespace
          </p>
          {watchingOther && (
            <Button
              width="w-52"
              className="absolute right-0 h-full top-0 text-sm p-1 rounded font-semibold"
              textColor="text-secondary"
              bgColor="bg-gray"
              handlerFunction={handleBackToMyCodespace}
            >
              Back to my codespace
            </Button>
          )}
        </div>
        <div className="h-[95%]">
          <Monaco />
        </div>
      </div>
      <div className="rightSidebar w-full h-[50vh]">
        <RightSidebar />
      </div>
    </div>
  );
}

export default Editor;
