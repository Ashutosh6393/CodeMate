import React, { useRef, useEffect, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useAppContext } from "../../context/appContext";
import { EVENTS } from "../../events";

const Monaco = ({socket}) => {
  const editorRef = useRef(null);
  const valueRef = useRef("");
  const monaco = useMonaco();
  const { language } = useAppContext();

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
    valueRef.current = editor.getValue();

    editor.onDidChangeModelContent((e, ) => {
      valueRef.current = editor.getValue();
      socket.current.emit(EVENTS.CODE_CHANGE, valueRef.current);
      // console.log(editor);
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
