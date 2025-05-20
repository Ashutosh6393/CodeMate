import { useEffect } from "react";
import { appContextType } from "../context/AppContext";

export const useEnableEditor = (appCtx: appContextType) => {
  const { isMonacoReady, monacoRef, editorDisabled } = appCtx;

  useEffect(() => {
    if (isMonacoReady && monacoRef.current?.editor) {
      const editorInstance = monacoRef.current.editor.getEditors()[0];
      editorInstance?.updateOptions({ readOnly: editorDisabled });
    }
  }, [editorDisabled]);
};
