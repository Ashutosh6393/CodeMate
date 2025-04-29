import AuthProvider from "./context/AuthContext.tsx";
import { Toaster } from "@/components/ui/sonner";
import { createRoot } from "react-dom/client";
import SocketProvider from "./context/SocketContext.tsx";
import SettingProvider, { SettingContext } from "./context/SettingContext.tsx";
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
    </AuthProvider>
  </StrictMode>
);
