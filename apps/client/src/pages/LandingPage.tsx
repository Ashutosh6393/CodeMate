import { Button } from "@/components/ui/button";
import { useEffect } from "react";

type Props = {};

const LandingPage = (props: Props) => {



  return (
    <main className=" grainy w-full h-screen flex justify-center items-center">
  
      <div className="px-60">
        <h1 className="text-purple-100 text-7xl font-bold font-pp mb-8">
          <span className="text-purple-900">C</span>ode
          <span className="text-purple-900">M</span>ate
        </h1>
        <h2 className="text-3xl/relaxed font-pp text-purple-100 font-semibold ">
          Collaborative coding in real-time with live syncing, compiling,
          authentication, and super-scalable sockets infrastructure.
        </h2>
        <div className="mt-10">
          <Button className="bg-purple-900 rounded-sm hover:bg-transparent hover:border-1 hover:border-purple-900 font-pp font-light text-xs">
            Open Codespace
          </Button>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
