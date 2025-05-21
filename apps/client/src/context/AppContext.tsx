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
};

export const AppContext = createContext<appContextType>(defaultAppContext);

type Props = {
  children: React.ReactNode;
};

const AppProvider: React.FC<Props> = ({ children }) => {
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
        setSharing,
        setWatchId,
        setViewers,
        allowEdit,
        monacoRef,
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
