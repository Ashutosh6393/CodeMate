import { AppContext } from "./appContext";
import React, { useState, useRef } from "react";

function AppContextProvider({ children }) {
  const [code, setCode] = useState("");
  const [myInfo, setMyInfo] = useState({});
  const [language, setLanguage] = useState("javascript");
  const [watchingOther, setWatchingOther] = useState(false);
  const [currentlyWatching, setCurrentlyWatching] = useState(null);
  const socket = useRef(null)
  const codeValueRef = useRef(null)
  const [members, setMembers] = useState([]);

  const ctxValue = {
    code,
    socket,
    myInfo,
    setCode,
    members,
    language,
    setMyInfo,
    setMembers,
    setLanguage,
    codeValueRef,
    watchingOther,
    setWatchingOther,
    currentlyWatching,
    setCurrentlyWatching,
  };

  return <AppContext.Provider value={ctxValue}>{children}</AppContext.Provider>;
}

export default AppContextProvider;
