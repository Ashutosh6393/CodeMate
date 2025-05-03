import { Monaco } from "@monaco-editor/react";
import React, {
  SetStateAction,
  createContext,
  useState,
  Dispatch,
  useRef,
} from "react";

interface defaultTypes {
  setIsMonacoReady: Dispatch<SetStateAction<boolean>>;
  setWatchId: Dispatch<SetStateAction<string | null>>;
  setAllowEdit: Dispatch<SetStateAction<boolean>>;
  pendingCodeRef: React.RefObject<string | null>;
  setSharing: Dispatch<SetStateAction<boolean>>;
  monacoRef: React.RefObject<Monaco | null>;
  codeRef: React.RefObject<string>;
  watchId: string | null;
  allowEdit: boolean;
  sharing: boolean;
  isMonacoReady: boolean;
}

const defaultAppContext: defaultTypes = {
  pendingCodeRef: { current: null },
  monacoRef: { current: null },
  setIsMonacoReady: () => {},
  codeRef: { current: "" },
  setAllowEdit: () => {},
  setSharing: () => {},
  setWatchId: () => {},
  isMonacoReady: false,
  allowEdit: false,
  sharing: false,
  watchId: null,
};

export const AppContext = createContext(defaultAppContext);

type Props = {
  children: React.ReactNode;
};

const AppProvider: React.FC<Props> = ({ children }) => {
  const [watchId, setWatchId] = useState<string | null>(null);
  const [allowEdit, setAllowEdit] = useState(false);
  const [sharing, setSharing] = useState(false);
  const monacoRef = useRef<Monaco | null>(null);
  const codeRef = useRef("");

  const [isMonacoReady, setIsMonacoReady] = useState(false);
  const pendingCodeRef = useRef<string | null>(null);

  return (
    <AppContext.Provider
      value={{
        setIsMonacoReady,
        pendingCodeRef,
        isMonacoReady,
        setAllowEdit,
        setSharing,
        setWatchId,
        allowEdit,
        monacoRef,
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
