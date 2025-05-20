import { OnMount } from "@monaco-editor/react";
import { monacoEditorOptions } from "../lib/editorOptions";

export const useOnEditorMount = (
  setIsMonacoReady: (ready: boolean) => void,
  monacoRef: any,
  pendingCodeRef: any
): OnMount => {
  return (editor, monaco) => {
    setIsMonacoReady(true);
    if (pendingCodeRef.current) {
      editor.setValue(pendingCodeRef.current);
      pendingCodeRef.current = null;
    }

    editor.focus();
    editor.updateOptions(monacoEditorOptions);
    monacoRef.current = monaco;
  };
};
