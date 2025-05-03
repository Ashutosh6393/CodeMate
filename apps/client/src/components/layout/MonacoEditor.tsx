import { SocketContext } from "../../context/SocketContext.tsx";
import { AppContext } from "../../context/AppContext.tsx";
import { useDebounce } from "../../lib/useDebounce.ts";
import Editor, { OnMount } from "@monaco-editor/react";
import { FaSpinner } from "react-icons/fa";
import { useContext } from "react";
type Props = {
  language: string;
};

const MonacoEditor = ({ language }: Props) => {
  const { monacoRef, codeRef } = useContext(AppContext);
  const { sendMessage } = useContext(SocketContext);
  const { sharing } = useContext(AppContext);

  const debounceSend = useDebounce((code: string) => {
    sendMessage({ message: "code", data: code });
  }, 300);

  const handleOnChange = (value: string | undefined) => {
    codeRef.current = value || "";

    if (sharing) {
      debounceSend(codeRef.current);
    }
  };

  const handleAfterEditorMount: OnMount = (editor, monaco) => {
    editor.focus();
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
    monacoRef.current = monaco;
  };

  return (
    <div className="w-full h-full rounded-md overflow-hidden border-2 border-white/10">
      <Editor
        theme="vs-dark"
        className="h-full w-full rounded-lg "
        language={language.toLowerCase()}
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
