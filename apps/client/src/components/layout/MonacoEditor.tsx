import { useRef, useContext } from "react";
import { CodeContext } from "../../context/codeContext.tsx";
import Editor, { Monaco, OnMount } from "@monaco-editor/react";
import { FaSpinner } from "react-icons/fa";

type Props = {
  language: string;
};

const MonacoEditor = ({ language }: Props) => {
  const { monacoRef, codeRef } = useContext(CodeContext);

  const handleOnChange = (value: string | undefined) => {
    if (value) {
      codeRef.current = value;
    }
  };

  const handleAfterEditorMount: OnMount = (editor, monaco) => {
    editor.focus();
    // monaco.editor.setTheme("vs-dark");
    editor.updateOptions({
      "semanticHighlighting.enabled": true,
      defaultColorDecorators: true,
      lineNumbers: "on",
      mouseWheelZoom: true,
      autoClosingBrackets: "always",
      autoSurround: "languageDefined",
      autoClosingQuotes: "always",
      autoIndent: "full",

      padding: {
        top: 20,
        bottom: 20,
      },
      fontSize: 16,
      scrollbar: {
        vertical: "auto",
      },
      scrollBeyondLastLine: false,
      quickSuggestions: true,
      parameterHints: {
        enabled: true,
      },

      wordBasedSuggestions: "allDocuments",
      suggest: {
        insertMode: "insert",
        preview: true,
        showSnippets: true,
        showKeywords: true,
        showClasses: true,
        showVariables: true,
      },
    });
    editor.getValue();
    monacoRef.current = monaco;
  };

  return (
    <div className="w-full h-full rounded-md overflow-hidden border-2 border-white/10">
      <Editor
        theme="vs-dark"
        className="h-full w-full rounded-lg "
        language={language.toLocaleLowerCase()}
        defaultLanguage="javascript"
        onMount={handleAfterEditorMount}
        loading={
          <div>
            <FaSpinner className="animate-spin text-white" />
          </div>
        }
        onChange={handleOnChange}
      />
    </div>
  );
};

export default MonacoEditor;
