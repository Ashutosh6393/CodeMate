import SocketProvider from "./context/SocketContext.tsx";
import SettingProvider from "./context/AppContext.tsx";
import AuthProvider from "./context/AuthContext.tsx";
import { Toaster } from "@/components/ui/sonner";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { StrictMode } from "react";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <SettingProvider>
        <SocketProvider>
          <BrowserRouter>
            <App />
            <Toaster />
          </BrowserRouter>
        </SocketProvider>
      </SettingProvider>
      <SettingProvider>
        <SocketProvider>
          <BrowserRouter>
            <App />
            <Toaster />
          </BrowserRouter>
        </SocketProvider>
      </SettingProvider>
    </AuthProvider>
  </StrictMode>
);
