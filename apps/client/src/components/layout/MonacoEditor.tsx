import { useRef } from "react";
import Editor, { Monaco, OnMount } from "@monaco-editor/react";

type Props = {
  language: string;
};

const MonacoEditor = ({ language }: Props) => {
  const monacoRef = useRef<Monaco | null>(null);
  const handleAfterEditorMount: OnMount = (editor, monaco) => {
    editor.focus();
    monaco.editor.setTheme("vs-dark");
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
    <Editor
      className="h-full w-full rounded-lg "
      language={language}
      defaultLanguage="javascript"
      onMount={handleAfterEditorMount}
    />
  );
};

export default MonacoEditor;
