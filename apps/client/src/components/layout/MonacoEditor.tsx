import { SocketContext } from "../../context/SocketContext.tsx";
import { AppContext } from "../../context/AppContext.tsx";
import { useDebounce } from "../../lib/useDebounce.ts";
import Editor, { OnMount } from "@monaco-editor/react";
import { useContext, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
type Props = {
  language: string;
};

const MonacoEditor = ({ language }: Props) => {
  const { sendMessage, isRemoteUpdateRef } = useContext(SocketContext);
  const {
    codeRef,
    watchId,
    sharing,
    allowEdit,
    monacoRef,
    isMonacoReady,
    editorDisabled,
    pendingCodeRef,
    setIsMonacoReady,
  } = useContext(AppContext);

  useEffect(() => {
    if (sharing) {
      sendMessage({ message: "ALLOW_EDIT", data: allowEdit });
    }
  }, [allowEdit]);

  useEffect(() => {
    if (isMonacoReady && monacoRef.current?.editor) {
      const editorInstance = monacoRef.current.editor.getEditors()[0];
      editorInstance?.updateOptions({ readOnly: editorDisabled });
    }
  }, [editorDisabled]);

  const shareCodeHandler = useDebounce((code: string) => {
    sendMessage({ message: "REALTIME_CODE", data: code });
  }, 300);

  const handleOnChange = (value: string | undefined) => {
    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }
    codeRef.current = value || "";
    if (sharing) {
      shareCodeHandler(codeRef.current);
    }
    if (watchId && !editorDisabled && allowEdit) {
      shareCodeHandler(codeRef.current);
    }
  };

  const handleAfterEditorMount: OnMount = (editor, monaco) => {
    setIsMonacoReady(true);
    if (pendingCodeRef.current) {
      editor.setValue(pendingCodeRef.current);
      pendingCodeRef.current = null;
    }

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
    <div className="w-full h-full rounded-md  border-2 border-white/10">
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
