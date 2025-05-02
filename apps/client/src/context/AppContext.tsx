import { Monaco } from "@monaco-editor/react";
import React, {
  SetStateAction,
  createContext,
  useState,
  Dispatch,
  useRef,
} from "react";

interface defaultTypes {
  setWatchId: Dispatch<SetStateAction<string | null>>;
  setAllowEdit: Dispatch<SetStateAction<boolean>>;
  setSharing: Dispatch<SetStateAction<boolean>>;
  monacoRef: React.RefObject<Monaco | null>;
  codeRef: React.RefObject<string>;
  watchId: string | null;
  allowEdit: boolean;
  sharing: boolean;
}

const defaultAppContext: defaultTypes = {
  monacoRef: { current: null },
  codeRef: { current: "" },
  setAllowEdit: () => {},
  setSharing: () => {},
  setWatchId: () => {},
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

  return (
    <AppContext.Provider
      value={{
        sharing,
        setSharing,
        allowEdit,
        setAllowEdit,
        watchId,
        setWatchId,
        monacoRef,
        codeRef,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
