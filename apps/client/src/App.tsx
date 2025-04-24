import SettingProvider from "./context/settingContext.tsx";
import Protected from "./components/common/Protected.tsx";
import LandingPage from "./pages/LandingPage";
import CodeSpace from "./pages/CodeSpace.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import { Routes, Route } from "react-router";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route
        path="/codespace"
        element={
          <Protected>
            <SettingProvider>
              <CodeSpace />
            </SettingProvider>
          </Protected>
        }
      />
      <Route path="*" element={<ErrorPage text="Page Not Found!" />} />
    </Routes>
  );
}

export default App;
