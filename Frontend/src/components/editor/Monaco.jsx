import { EVENTS } from "../../events";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useAppContext } from "../../context/appContext";
import React, { useRef, useEffect, useState } from "react";

const Monaco = () => {
  const editorRef = useRef(null);
  const monaco = useMonaco();
  const { language, watchingOther, myInfo, socket, codeValueRef } =
    useAppContext();

  useEffect(() => {
    const changeLanguage = () => {
      if (editorRef.current && monaco) {
        const model = editorRef.current.getModel();
        if (model) {
          monaco.editor.setModelLanguage(model, language);
        }
      }
    };
    changeLanguage();
  }, [language]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    if (!watchingOther) codeValueRef.current = editor.getValue();
    editor.onDidChangeModelContent((e) => {
      if (!watchingOther) {
        codeValueRef.current = editor.getValue();

        //send you code to server here
        socket.current
          .to(myInfo.socketId)
          .emit(EVENTS.CODE_CHANGE, codeValueRef.current);
      }
    });

    editor.updateOptions({
      theme: "vs-dark",
      language: "javascript",
      automaticLayout: true,
      lineNumbers: "on",
    });
    monaco.languages.register({ id: "java" });
    monaco.languages.register({ id: "python" });
    monaco.languages.register({ id: "cpp" });
  };

  return (
    <Editor
      height="100%"
      width="100%"
      defaultLanguage="javascript"
      language={language}
      defaultValue="// type your code here"
      theme="vs-dark"
      onMount={handleEditorDidMount}
      options={{
        padding: { bottom: 0, top: 0 },
        fontSize: 16,
        scrollbar: { vertical: "hidden" },
        minimap: { enabled: false },
        scrollBeyondLastLine: true,

        suggestOnTriggerCharacters: false,
        quickSuggestions: true,
        parameterHints: {
          enabled: false,
        },
        wordBasedSuggestions: false,
        showKeywords: false,
        showSnippets: false,
      }}
    />
  );
};

export default Monaco;
