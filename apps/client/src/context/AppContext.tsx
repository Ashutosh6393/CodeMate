import { Monaco } from "@monaco-editor/react";
import React, {
  SetStateAction,
  createContext,
  useState,
  Dispatch,
  useRef,
} from "react";

export interface appContextType {
  setViewers: Dispatch<SetStateAction<{ userId: string; username: string }[]>>;
  setEditorDisabled: Dispatch<SetStateAction<boolean>>;
  setIsMonacoReady: Dispatch<SetStateAction<boolean>>;
  setWatchId: Dispatch<SetStateAction<string | null>>;
  setAllowEdit: Dispatch<SetStateAction<boolean>>;
  pendingCodeRef: React.RefObject<string | null>;
  setSharing: Dispatch<SetStateAction<boolean>>;
  viewers: { userId: string; username: string }[];
  monacoRef: React.RefObject<Monaco | null>;
  codeRef: React.RefObject<string>;
  editorDisabled: boolean;
  watchId: string | null;
  isMonacoReady: boolean;
  allowEdit: boolean;
  sharing: boolean;
  language: { id: number; lang: string };
  setLanguage: Dispatch<SetStateAction<{ id: number; lang: string }>>;
}

const defaultAppContext: appContextType = {
  pendingCodeRef: { current: null },
  monacoRef: { current: null },
  setEditorDisabled: () => {},
  setIsMonacoReady: () => {},
  codeRef: { current: "" },
  setAllowEdit: () => {},
  editorDisabled: false,
  setSharing: () => {},
  setViewers: () => {},
  setWatchId: () => {},
  isMonacoReady: false,
  allowEdit: false,
  sharing: false,
  watchId: null,
  viewers: [],
  language: { id: 102, lang: "Javascript" },
  setLanguage: () => {},
};

export const AppContext = createContext<appContextType>(defaultAppContext);

type Props = {
  children: React.ReactNode;
};

const AppProvider: React.FC<Props> = ({ children }) => {
  const [language, setLanguage] = useState<{ id: number; lang: string }>({
    id: 102,
    lang: "Javascript",
  });
  const [watchId, setWatchId] = useState<string | null>(null);
  const [editorDisabled, setEditorDisabled] = useState(false);
  const [isMonacoReady, setIsMonacoReady] = useState(false);
  const pendingCodeRef = useRef<string | null>(null);
  const [allowEdit, setAllowEdit] = useState(false);
  const [sharing, setSharing] = useState(false);
  const monacoRef = useRef<Monaco | null>(null);
  const [viewers, setViewers] = useState<
    { userId: string; username: string }[]
  >([]);
  const codeRef = useRef("");

  return (
    <AppContext.Provider
      value={{
        setEditorDisabled,
        setIsMonacoReady,
        editorDisabled,
        pendingCodeRef,
        isMonacoReady,
        setAllowEdit,
        setLanguage,
        setSharing,
        setWatchId,
        setViewers,
        allowEdit,
        monacoRef,
        language,
        viewers,
        codeRef,
        sharing,
        watchId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const AppContextType = typeof AppContext;

export default AppProvider;
