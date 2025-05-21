import { Button } from "../components/ui/button";
import Loader from "../components/common/Loader";
import { useNavigate } from "react-router";
import React from "react";

type Props = {
  text?: string;
  showButton?: boolean;
  loader?: boolean;
};

const ErrorPage: React.FC<Props> = ({
  text,
  showButton = true,
  loader = false,
}) => {
  const navigate = useNavigate();
  return (
    <div className="grainy w-full h-screen flex flex-col gap-5 justify-center items-center">
      {loader ? (
        <Loader />
      ) : (
        <p className="text-2xl font-bold text-purple-50">{text}</p>
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
