import React from "react";
import { Textbox, Button, Select } from "../index";
import { useAppContext } from "../../context/appContext";
import { EVENTS } from "../../events";

function RightSidebar() {
  const {socketRef, editorCurrentValue, language} = useAppContext();

  const handleRunCode = ()=>{
    if(socketRef.current && editorCurrentValue){
      socketRef.current.emit(EVENTS.RUN, {code: editorCurrentValue.current, language: language });
      console.log('run code clicked');
    }
  }

  return (
    <div className="text-white-0 bg-bg-1 h-full py-5 p-2 flex flex-col gap-2">
      <div className="h-12 w-full flex gap-5 justify-center items-center">
        <div className="w-1/3">
          <Button handlerFunction={handleRunCode} bgColor="bg-green" textColor="text-white-0">
            Run
          </Button>
        </div>
        <div className="w-2/3">
          <Select></Select>
        </div>
      </div>
      <div className="input w-full flex-grow flex flex-col gap-1">
        <p className="font-semibold px-2">Input</p>
        <Textbox />
      </div>
      <div className="output w-full flex-grow flex flex-col gap-1">
        <p className="font-semibold px-2">Output</p>
        <Textbox readOnly />
      </div>
    </div>
  );
}

export default RightSidebar;
