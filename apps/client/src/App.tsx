import { verifyAuth, healthCheck } from "./lib/apiCalls.ts";
import SettingProvider from "./context/SettingContext.tsx";
import Protected from "./components/common/Protected.tsx";
import { AuthContext } from "./context/AuthContext.tsx";
import CodeProvider from "./context/CodeContext.tsx";
import ProtectedPage from "./pages/ErrorPage.tsx";
import LandingPage from "./pages/LandingPage";
import CodeSpace from "./pages/CodeSpace.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import { Routes, Route } from "react-router";
import { useEffect, useState } from "react";
import { useContext } from "react";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [serverOk, setServerOk] = useState<boolean>(false);
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    const checkServerAndAuth = async () => {
      healthCheck()
        .then(() => {
          setServerOk(true);
        })
        .catch((error) => {
          console.log("error health check error in app", error);
        });

      verifyAuth()
        .then((res) => {
          setUser(res.data);
        })
        .catch((error) => {
        })
        .finally(() => {
          setLoading(false);
        });
    };
    checkServerAndAuth();
  }, []);

  if (loading) {
    return <ErrorPage loader showButton={false} />;
  }

  if (!serverOk) {
    return (
      <ProtectedPage
        text="It's not you, It's us... Our Server seems to be down :("
        showButton={false}
      />
    );
  }

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
