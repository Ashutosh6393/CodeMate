import { AppContext } from "./appContext";
import React, { useState } from "react";

function AppContextProvider({ children }) {
  const [language, setLanguage] = useState("javascript");

  const ctxValue = {
    language,
    setLanguage,
  };

  return <AppContext.Provider value={ctxValue}>{children}</AppContext.Provider>;
}

export default AppContextProvider;
