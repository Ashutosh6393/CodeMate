import React, { useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useAppContext } from "../../context/appContext";
import { EVENTS } from "../../events";

const Monaco = () => {
  const monaco = useMonaco();
  const { language, editorRef, editorCurrentValue, watchingOther, socketRef } =
    useAppContext();

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ readOnly: watchingOther });
    }
  }, [watchingOther]);

  const handleOnMount = (editor) => {
    editorRef.current = editor;
    editorCurrentValue.current = editor.getValue();
    editor.onDidChangeModelContent(() => {
      if (!watchingOther && socketRef.current) {
        editorCurrentValue.current = editor.getValue();
        if (socketRef.current) {
          socketRef.current.emit(EVENTS.SEND_CODE_TO_SUBSCRIBERS, editor.getValue());
        }
      }
    });

    editor.updateOptions({
      theme: "vs-dark",
      automaticLayout: true,
      lineNumbers: "on",
    });
    if (monaco) {
      monaco.languages.register({ id: "java" });
      monaco.languages.register({ id: "python" });
      monaco.languages.register({ id: "cpp" });
    }
  };

  useEffect(() => {
    if (editorRef.current && monaco) {
      const model = editorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [language, monaco, socketRef]);

  return (
    <Editor
      height="100%"
      width="100%"
      defaultLanguage="javascript"
      language={language}
      defaultValue="// type your code here"
      theme="vs-dark"
      onMount={handleOnMount}
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
