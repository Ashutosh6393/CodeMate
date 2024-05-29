import { createContext, useContext } from "react";

export const AppContext = createContext({
  code: "",
  members: [],
  socket: null,
  codeRef: null,
  setCode: () => {},
  setMyInfo: () => {},
  language: "language",
  setMembers: () => {},
  watchingOther: false,
  setLanguage: () => {},
  currentlyWatching: "",
  setWatchingOther: () => {},
  setCurrentlyWatching: () => {},
  myInfo: { username: "", socketId: "" },

});

export const useAppContext = () => {
  return useContext(AppContext);
};
