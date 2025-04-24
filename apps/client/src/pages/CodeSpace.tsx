import { AuthContext } from "../context/AuthContext.tsx";
import { useContext, useState } from "react";
import Navbar from "../components/layout/Navbar.tsx";
import MonacoEditor from "../components/layout/MonacoEditor.tsx";
import { Textarea } from "@/components/ui/textarea";

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
import { Button } from "../components/ui/button.tsx";
import { SettingContext } from "../context/settingContext.tsx";

const CodeSpace = () => {
  const [language, setLanguage] = useState("javascript");
  const handleLanguageSelect = (value: string) => {
    setLanguage(value);
  };
  return (
    <main className="bg-neutral-900  w-full h-screen flex flex-col">
      <Navbar />
      <div className="w-full flex-1 border-t border-zinc-700">
        <ResizablePanelGroup direction="horizontal" className=" w-full h-full">
          <ResizablePanel className="p-2 flex flex-col gap-2" defaultSize={75}>
            <Select onValueChange={handleLanguageSelect}>
              <SelectTrigger className="cursor-pointer w-30 focus-visible:ring-0 text-white data-[placeholder]:text-white  font-semibold border border-zinc-700 bg-zinc-900 ">
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

            <MonacoEditor language={language} />
          </ResizablePanel>
          <ResizableHandle className="bg-zinc-700/50" />
          <ResizablePanel className="p-2 flex flex-col gap-2 justify-start items-start">
            <Button className="cursor-pointer bg-green-800 hover:bg-green-900 hover:text-zinc-300 text-zinc-300">
              Run Code
            </Button>
            <Textarea
              placeholder="Output"
              readOnly
              
              className="w-full resize-none h-full border-2 border-white/10 focus-visible:border-white/10 focus-visible:ring-0 font-normal text-muted-foreground bg-[#1E1E1E]"
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
};

export default CodeSpace;
