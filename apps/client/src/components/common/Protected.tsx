import { AuthContext } from "../../context/AuthContext.tsx";
import { verifyAuth } from "../../lib/verifyAuth.ts";
import ErrorPage from "../../pages/ErrorPage.tsx";
import { useContext, useEffect } from "react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Protected = (props: Props) => {
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await verifyAuth();
        setUser(res.data?.data);
      } catch (error) {}
    }

    if (!user) {
      checkAuth();
    }
  });

  return (
    <>
      {user ? (
        props.children
      ) : (
        <ErrorPage text="You need to login to access this page" />
      )}
    </>
  );
};

export default Protected;
