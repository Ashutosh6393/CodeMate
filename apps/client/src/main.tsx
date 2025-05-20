import SocketProvider from "./context/SocketContext";
import SettingProvider from "./context/AppContext";
import AuthProvider from "./context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { StrictMode } from "react";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SettingProvider>
          <SocketProvider>
            <App />
            <Toaster />
          </SocketProvider>
        </SettingProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
