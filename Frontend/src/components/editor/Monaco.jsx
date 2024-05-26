// MonacoEditorComponent.js

import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const Monaco = () => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Set editor options
    editor.updateOptions({
      theme: 'vs-dark', // Dark theme
      language: 'javascript', // Default language
      automaticLayout: true, // Adjust layout automatically
      lineNumbers: 'on', // Show line numbers
    });

    // Add support for other languages
    monaco.languages.register({ id: 'java' });
    monaco.languages.register({ id: 'python' });
    monaco.languages.register({ id: 'cpp' });

    // You can also add custom configurations for these languages if needed
  };

  return (
    
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="javascript"
        defaultValue="// type your code here"
        theme="vs-dark"
        onMount={handleEditorDidMount}
        options={{padding: {bottom: 0, top: 0}, fontSize: 16, scrollbar: {vertical: "hidden"}, minimap: {enabled: false}, scrollBeyondLastLine: true}}
      />
  );
};

export default Monaco;
