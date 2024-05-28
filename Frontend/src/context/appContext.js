import { createContext, useContext } from "react";

export const AppContext = createContext({
  language: "language",

  setLanguage: () => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};
