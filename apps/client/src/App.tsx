import { useEffect, useState, useContext } from "react";
import { Routes, Route } from "react-router";

import { verifyAuth, healthCheck } from "./lib/apiCalls";
import { AuthContext } from "./context/AuthContext";

import Protected from "./components/common/Protected";
import ProtectedPage from "./pages/ErrorPage";
import ErrorPage from "./pages/ErrorPage";
import LandingPage from "./pages/LandingPage";
import CodeSpace from "./pages/CodeSpace";

import "./App.css";

function App() {
  const [serverOk, setServerOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    const checkServerAndAuth = async () => {
      try {
        await healthCheck();
        setServerOk(true);
      } catch {
        setServerOk(false);
      }

      try {
        const res = await verifyAuth();
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkServerAndAuth();
  }, [setUser]);

  if (loading) {
    return <ErrorPage loader showButton={false} />;
  }

  if (!serverOk) {
    return (
      <ProtectedPage
        text="It's not you, it's us... Our server seems to be down :("
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
