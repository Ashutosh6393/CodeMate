import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

type User = {
  userId: string;
  email: string;
  name: string;
};

type Props = {
  children: React.ReactNode;
};

const defaultAuthContext: AuthContextType = {
  user: null,
  setUser: () => {},
};

export const AuthContext = createContext(defaultAuthContext);

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
