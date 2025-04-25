import MonacoEditor from "../components/layout/MonacoEditor.tsx";
import { CodeContext } from "../context/codeContext.tsx";
import Navbar from "../components/layout/Navbar.tsx";
import { Button } from "../components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea";
import { submitCode } from "../lib/runCode.ts";
import { useContext, useState, useRef } from "react";
import { FaRegCopy } from "react-icons/fa6";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [language, setLanguage] = useState<{ id: number; lang: string }>({
    id: 102,
    lang: "Javascript",
  });
  const { codeRef } = useContext(CodeContext);
  const handleLanguageSelect = (value: string) => {
    languages.forEach((lang) => {
      if (lang.lang === value) {
        setLanguage(() => lang);
      }
    });
  };

  const handleCodeSubmit = async () => {
    const data = await submitCode(codeRef.current, language.id);
    console.log(data);
  };

  const handleCopy = () => {
    window.navigator.clipboard.writeText(codeRef.current);
    toast.success("Copied to clipboard");
  };

  const languages = [
    { id: 102, lang: "Javascript" },
    { id: 1, lang: "HTML" },
    { id: 2, lang: "CSS" },
    { id: 105, lang: "C++" },
    { id: 71, lang: "Python" },
    { id: 91, lang: "Java" },
  ];
  return (
    <main className="bg-neutral-900  w-full h-screen flex flex-col">
      <Navbar />
      <div className="w-full flex-1 border-t border-zinc-700">
        <ResizablePanelGroup direction="horizontal" className=" w-full h-full">
          <ResizablePanel className="p-2 flex flex-col gap-2" defaultSize={75}>
            <div className="flex justify-between items-center pr-5">
              <Select onValueChange={handleLanguageSelect}>
                <SelectTrigger className="cursor-pointer w-30 focus-visible:ring-0 text-white data-[placeholder]:text-white  font-semibold border border-zinc-700 bg-zinc-900 ">
                  <SelectValue
                    placeholder="Javascript"
                    defaultValue={"javascript"}
                    className="text-white border-none"
                  />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => {
                    return (
                      <SelectItem key={language.id} value={language.lang}>
                        {language.lang}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    className="cursor-pointer"
                    onClick={handleCopy}
                  >
                    <FaRegCopy className="text-white" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy Code</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <MonacoEditor language={language.lang} />
          </ResizablePanel>
          <ResizableHandle className="bg-zinc-700/50" />
          <ResizablePanel className="p-2 flex flex-col gap-2 justify-start items-start">
            <Button
              className="cursor-pointer bg-green-800 hover:bg-green-900 hover:text-zinc-300 text-zinc-300"
              onClick={handleCodeSubmit}
            >
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
