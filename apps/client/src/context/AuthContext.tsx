import React, { createContext, useState } from "react";
import axios from "axios";

type User = {
  id: string;
  email: string;
  name: string;
};

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
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

  

  // fetch auth


  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

/*

step 1. import createContext from "react"
step 2. create context: export const AuthContext = createContext({
        user: null,
        })
step 3. create provider: export const AuthProvider = (props) => {
        return <AuthContext.Provider value={}>{props.children}</AuthContext.Provider>;
        }
step 4. import AuthProvider in App.js and wrap App in AuthProvider
step 5. import AuthContext in other components
step 6. provide value in AuthContext.Provider


 */
