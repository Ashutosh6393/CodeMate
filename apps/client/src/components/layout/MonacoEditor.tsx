import { useOnEditorMount } from "../../hooks/useOnEditorMount.ts";
import { useEnableEditor } from "../../hooks/useEnableEditor.ts";
import { SocketContext } from "../../context/SocketContext.tsx";
import { AppContext } from "../../context/AppContext.tsx";
import { useDebounce } from "../../lib/useDebounce.ts";
import { useContext, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import Editor from "@monaco-editor/react";

type Props = {
  language: string;
};

const MonacoEditor = ({ language }: Props) => {
  const { sendMessage, isRemoteUpdateRef } = useContext(SocketContext);
  const appCtx = useContext(AppContext);
  const {
    codeRef,
    watchId,
    sharing,
    allowEdit,
    pendingCodeRef,
    monacoRef,
    editorDisabled,
    setIsMonacoReady,
  } = appCtx;

  const shareCodeHandler = useDebounce((code: string) => {
    sendMessage({ message: "REALTIME_CODE", data: code });
  }, 300);

  const shouldSyncCode = () =>
    sharing || (watchId && !editorDisabled && allowEdit);

  const handleOnChange = (value: string | undefined) => {
    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }
    const newCode = value || "";
    codeRef.current = newCode;

    if (shouldSyncCode()) {
      shareCodeHandler(newCode);
    }
  };

  const handleAfterEditorMount = useOnEditorMount(
    setIsMonacoReady,
    monacoRef,
    pendingCodeRef
  );

  useEffect(() => {
    if (sharing) {
      sendMessage({ message: "ALLOW_EDIT", data: allowEdit });
    }
  }, [allowEdit]);

  useEnableEditor(appCtx);

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
