import React, { createContext, Dispatch, SetStateAction, useState } from "react";

type User = {
  userId: string;
  email: string;
  name: string;
};

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  setUser: () => {},
};

export const AuthContext = createContext(defaultAuthContext);

type Props = {
  children: React.ReactNode;
};

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
