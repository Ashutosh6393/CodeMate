import { OnMount } from "@monaco-editor/react";
import { monacoEditorOptions } from "../lib/editorOptions";
import { Monaco } from "@monaco-editor/react";

export const useOnEditorMount = (
  setIsMonacoReady: (ready: boolean) => void,
  monacoRef: React.RefObject<Monaco | null>,
  pendingCodeRef: React.RefObject<string | null>,
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
