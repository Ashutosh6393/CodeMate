export const monacoEditorOptions = {
  semanticHighlighting: { enabled: true },
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
} as const;
