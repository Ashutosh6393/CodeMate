import React, {
  SetStateAction,
  createContext,
  useState,
  Dispatch,
} from "react";

interface defaultTypes {
  sharing: boolean;
  allowEdit: boolean;
  setSharing: Dispatch<SetStateAction<boolean>>;
  setAllowEdit: Dispatch<SetStateAction<boolean>>;
}

const defaultSettingContext: defaultTypes = {
  sharing: false,
  allowEdit: false,
  setSharing: () => {},
  setAllowEdit: () => {},
};

export const SettingContext = createContext(defaultSettingContext);

type Props = {
  children: React.ReactNode;
};

const SettingProvider: React.FC<Props> = ({ children }) => {
  const [sharing, setSharing] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);

  return (
    <SettingContext.Provider
      value={{ sharing, setSharing, allowEdit, setAllowEdit }}
    >
      {children}
    </SettingContext.Provider>
  );
};

export default SettingProvider;
