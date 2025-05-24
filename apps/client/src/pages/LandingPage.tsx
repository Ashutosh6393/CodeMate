import LoginDialog from "../components/LoginDialog";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { useContext } from "react";

const LandingPage = () => {
  const dd = import.meta.env.VITE_SERVER_URL;
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <main className=" grainy w-full h-screen flex justify-center items-center">
      <div className="px-60">
        <h1 className="text-purple-100 text-7xl font-bold font-pp mb-8">
          <span className="text-green-800">C</span>ode
          <span className="text-green-800">M</span>ate
        </h1>
        <h2 className="text-2xl/relaxed font-pp text-purple-100 font-semibold ">
          A collaborative{" "}
          <span className="px-3 pt-1 rounded-xl decoration-purple-900 bg-purple-900">
            real-time code editor
          </span>{" "}
          with live syncing, instant compiling, user authentication, and a
          highly scalable WebSocket infrastructure for seamless multi-user
          collaboration.\n server==={dd}
        </h2>
        <div className="mt-10">
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
