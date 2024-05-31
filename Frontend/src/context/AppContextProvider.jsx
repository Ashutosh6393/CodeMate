import { AppContext } from "./appContext";
import React, { useState, useRef } from "react";
function AppContextProvider({ children }) {
  const editorRef = useRef(null);
  const editorCurrentValue = useRef(null);
  const socketRef = useRef(null);
  const [code, setCode] = useState("");
  const [myInfo, setMyInfo] = useState({});
  const [members, setMembers] = useState([]);
  const [language, setLanguage] = useState("javascript");
  const [watchingOther, setWatchingOther] = useState(false);
  const [currentlyWatching, setCurrentlyWatching] = useState(null);

  const ctxValue = {
    editorRef,
    editorCurrentValue,
    code,
    setCode,
    myInfo,
    setMyInfo,
    members,
    setMembers,
    language,
    setLanguage,
    socketRef,
    watchingOther,
    setWatchingOther,
    currentlyWatching,
    setCurrentlyWatching,
  };

  return <AppContext.Provider value={ctxValue}>{children}</AppContext.Provider>;
}

export default AppContextProvider;
