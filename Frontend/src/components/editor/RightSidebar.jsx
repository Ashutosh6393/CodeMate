import React from "react";
import { Textbox, Button, Select } from "../index";
import { useAppContext } from "../../context/appContext";
import { useState, useRef } from "react";
import { EVENTS } from "../../events";
import axios from "axios";

function RightSidebar() {
  const inputValue = useRef(null);
  const outputValue = useRef(null);
  const { socketRef, editorCurrentValue, language } = useAppContext();
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = async () => {
    if (
      socketRef.current &&
      editorCurrentValue.current !== "// type your code here"
    ) {
      outputValue.current.value = "";
      setIsRunning(true);
      const data = {
        body: {
          code: editorCurrentValue.current,
          language: language,
          inputs: inputValue.current.value.split(/[\s\n]+/) || [],
        },
      };

      const url =
        "https://09lzduinjc.execute-api.ap-south-1.amazonaws.com/production/codemate-compiler";

      axios
        .post(url, data)
        .then(({ data }) => {
          if (JSON.parse(data.body).output) {
            outputValue.current.value = JSON.parse(data.body).output;
          } else {
            outputValue.current.value = JSON.parse(data.body).error;
          }
        })
        .catch((error) => {
          outputValue.current.value =
            "Could not execute code (some error occurred)";
        })
        .finally(() => {
          setIsRunning(false);
        });
    }
  };

  return (
    <div className="text-white-0 bg-bg-1 h-full py-5 p-2 flex flex-col gap-2">
      <div className="h-12 w-full flex gap-5 justify-center items-center">
        <div className="w-1/3">
          <Button
            handlerFunction={handleRunCode}
            bgColor={isRunning ? "bg-green-faded" : "bg-green"}
            textColor="text-white-0"
            disabled={isRunning}
          >
            Run
          </Button>
        </div>
        <div className="w-2/3">
          <Select></Select>
        </div>
      </div>
      <div className="input w-full flex-grow flex flex-col gap-1">
        <p className="font-semibold px-2">Input</p>
        <Textbox ref={inputValue} disabled={language === "javascript"} />
      </div>
      <div className="output w-full flex-grow flex flex-col gap-1">
        <p className="font-semibold px-2">Output</p>
        <Textbox ref={outputValue} readOnly />
      </div>
    </div>
  );
}

export default RightSidebar;
