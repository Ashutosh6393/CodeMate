import { Monaco } from "@monaco-editor/react";
import React, {
  SetStateAction,
  createContext,
  useState,
  Dispatch,
  useRef,
} from "react";

interface defaultTypes {
  setViewers: Dispatch<SetStateAction<{ userId: string; username: string }[]>>;
  setIsMonacoReady: Dispatch<SetStateAction<boolean>>;
  setWatchId: Dispatch<SetStateAction<string | null>>;
  setAllowEdit: Dispatch<SetStateAction<boolean>>;
  pendingCodeRef: React.RefObject<string | null>;
  setSharing: Dispatch<SetStateAction<boolean>>;
  viewers: { userId: string; username: string }[];
  monacoRef: React.RefObject<Monaco | null>;
  codeRef: React.RefObject<string>;
  watchId: string | null;
  isMonacoReady: boolean;
  allowEdit: boolean;
  sharing: boolean;
  editorDisabled: boolean;
  setEditorDisabled: Dispatch<SetStateAction<boolean>>;
}

const defaultAppContext: defaultTypes = {
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

export const AppContext = createContext(defaultAppContext);

type Props = {
  children: React.ReactNode;
};

const AppProvider: React.FC<Props> = ({ children }) => {
  const [viewers, setViewers] = useState<
    { userId: string; username: string }[]
  >([]);
  const [watchId, setWatchId] = useState<string | null>(null);
  const [allowEdit, setAllowEdit] = useState(false);
  const [sharing, setSharing] = useState(false);
  const monacoRef = useRef<Monaco | null>(null);
  const codeRef = useRef("");
  const [isMonacoReady, setIsMonacoReady] = useState(false);
  const pendingCodeRef = useRef<string | null>(null);
  const [editorDisabled, setEditorDisabled] = useState(false);
  

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

export default AppProvider;
