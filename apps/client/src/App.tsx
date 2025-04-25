import Protected from "./components/common/Protected.tsx";
import LandingPage from "./pages/LandingPage";
import CodeSpace from "./pages/CodeSpace.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import { Routes, Route } from "react-router";
import "./App.css";
import SettingProvider from "./context/SettingContext.tsx";
import CodeProvider from "./context/codeContext.tsx";

function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route
        path="/codespace"
        element={
          <Protected>
            <CodeProvider>
              <SettingProvider>
                <CodeSpace />
              </SettingProvider>
            </CodeProvider>
          </Protected>
        }
      />
      <Route path="*" element={<ErrorPage text="Page Not Found!" />} />
    </Routes>
  );
}

export default App;
