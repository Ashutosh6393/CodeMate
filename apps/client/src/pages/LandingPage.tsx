import LoginDialog from "../components/LoginDialog";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { useContext } from "react";

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <main className=" grainy w-full h-dvh flex justify-center items-center">
      <div className="px-10 md:px-20 lg:px-60 flex flex-col">
        <h1 className="text-purple-100 self-center md:self-center lg:self-start text-5xl md:text-7xl lg:text-7xl font-bold font-pp mb-8">
          <span className="text-purple-800">C</span>ode
          <span className="text-purple-800">M</span>ate
        </h1>
        <h2 className="text-sm text-center lg:text-left md:text-xl  lg:text-2xl/relaxed font-pp text-purple-100 font-light md:font-semibold ">
          A collaborative{" "}
          <span className="underline ">real-time code editor</span> with live
          syncing, instant compiling, user authentication, and a highly scalable
          WebSocket infrastructure for seamless multi-user collaboration.
        </h2>
        <div className="mt-10 self-center lg:self-start">
          <LoginDialog
            onClick={() => {
              if (user) {
                navigate("/codespace");
              }
            }}
            className="bg-purple-900 border-1 border-purple-900 rounded-sm hover:bg-transparent hover:border-1 hover:border-purple-900 font-pp text-xs"
            buttonText="Open Codespace"
          />
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
