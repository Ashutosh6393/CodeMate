import { Button } from "../components/ui/button";
import Loader from "../components/common/Loader";
import { useNavigate } from "react-router";
import React from "react";

type Props = {
  showButton?: boolean;
  loader?: boolean;
  children?: React.ReactNode;
};

const ErrorPage: React.FC<Props> = ({
  children,
  showButton = true,
  loader = false,
}) => {
  const navigate = useNavigate();
  return (
    <div className="grainy w-full h-screen flex flex-col gap-5 justify-center items-center">
      {loader ? (
        <Loader />
      ) : (
        <div className="text-center self-center font-bold md:text-xl text-purple-50">
          {children}
        </div>
      )}
      {showButton && (
        <Button
          className="bg-purple-900 border-purple-900 rounded-sm hover:bg-transparent hover:border-1 hover:border-purple-900 font-pp font-light text-xs"
          onClick={() => navigate("/")}
        >
          Go Home
        </Button>
      )}
    </div>
  );
};

export default ErrorPage;
