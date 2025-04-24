import { AuthContext } from "../context/AuthContext.tsx";
import { useContext,  useState } from "react";
import Navbar from "../components/layout/Navbar.tsx";
import MonacoEditor from "../components/layout/MonacoEditor.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const CodeSpace = () => {
  const { user } = useContext(AuthContext);
  const [language, setLanguage] = useState("javascript");
  const handleLanguageSelect = (value: string) => {
    setLanguage(value)
  };
  return (
    <main className="bg-zinc-900  w-full h-screen flex flex-col">
      <Navbar />
      <div className="w-full flex-1 border-t border-zinc-700">
        <ResizablePanelGroup direction="horizontal" className=" w-full h-full">
          <ResizablePanel className="p-2 flex flex-col gap-2" defaultSize={75}>
            <Select onValueChange={handleLanguageSelect}>
              <SelectTrigger className="w-30 focus-visible:ring-0 text-white data-[placeholder]:text-white  font-semibold border border-zinc-700 bg-zinc-900 ">
                <SelectValue
                  placeholder="Javascript"
                  defaultValue={"javascript"}
                  className="text-white border-none"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">Javascript</SelectItem>
                <SelectItem value="typescript">Typescript</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="c++">C++</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="python">Python</SelectItem>
              </SelectContent>
            </Select>

            <MonacoEditor language={language}/>
          </ResizablePanel>
          <ResizableHandle className="bg-zinc-700" />
          <ResizablePanel>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Content</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
};

export default CodeSpace;
