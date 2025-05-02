import { verifyAuth, healthCheck } from "./lib/apiCalls.ts";
import Protected from "./components/common/Protected.tsx";
import { AuthContext } from "./context/AuthContext.tsx";
import ProtectedPage from "./pages/ErrorPage.tsx";
import LandingPage from "./pages/LandingPage";
import CodeSpace from "./pages/CodeSpace.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import { Routes, Route } from "react-router";
import { useEffect, useState } from "react";
import { useContext } from "react";
import "./App.css";

function App() {
  const [serverOk, setServerOk] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    const checkServerAndAuth = async () => {
      healthCheck().then(() => {
        setServerOk(true);
      });

      verifyAuth()
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {})
        .catch((err) => {})
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
            <CodeSpace />
          </Protected>
        }
      />
      <Route path="*" element={<ErrorPage text="Page Not Found!" />} />
    </Routes>
  );
}

export default App;
