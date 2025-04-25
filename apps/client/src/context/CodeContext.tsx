import React, { createContext, useRef } from "react";
import { Monaco } from "@monaco-editor/react";

type Props = {
    children: React.ReactNode
};

interface CodeContextType {
  monacoRef: React.RefObject<Monaco | null>;
  codeRef: React.RefObject<string>
}

const defaultValue: CodeContextType = {
  monacoRef: { current: null }, 
  codeRef: { current: "" }
};

export const CodeContext = createContext<CodeContextType>(defaultValue);

const CodeProvider:React.FC<Props> = ({children}) => {
  const monacoRef = useRef<Monaco | null>(null);
  const codeRef =  useRef("")

  return (
    <CodeContext.Provider value={{ monacoRef, codeRef }}>
      {children}
    </CodeContext.Provider>
  );
};

export default CodeProvider;
