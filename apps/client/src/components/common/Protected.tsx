import { AuthContext } from "../../context/AuthContext.tsx";
import { useContext, useEffect, useState } from "react";
import { verifyAuth } from "../../lib/apiCalls.ts";
import ErrorPage from "../../pages/ErrorPage.tsx";
import { Navigate } from "react-router";
import { AxiosResponse } from "axios";
import React from "react";

type Props = {
  children: React.ReactNode;
};

type User = {
  userId: string;
  email: string;
  name: string;
};

const Protected: React.FC<Props> = ({ children }) => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      const res: AxiosResponse<User> = await verifyAuth();
      setUser(res.data);
    }
    if (!user) {
      checkAuth();
    }
    setLoading(false);
  });

  if (loading) {
    return <ErrorPage loader showButton={false} />;
  }

  return <>{user && !loading ? children : <Navigate to={"/"} />}</>;
};

export default Protected;
