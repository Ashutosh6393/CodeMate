import { createContext, useContext } from "react";

export const AppContext = createContext({
  code: "",
  members: [],
  socketRef: null,
  codeRef: null,
  editorRef: null,
  setCode: () => {},
  // setSocketRef: () => {},
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
