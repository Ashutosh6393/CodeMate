import MonacoEditor from "../components/layout/MonacoEditor.tsx";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../context/SocketContext.tsx";
import { useNavigate, useSearchParams } from "react-router";
import { AppContext } from "../context/AppContext.tsx";
import Navbar from "../components/layout/Navbar.tsx";
import { Button } from "../components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea";
import Loader from "../components/common/Loader.tsx";
import { runCode } from "../lib/apiCalls.ts";
import { FaRegCopy } from "react-icons/fa6";
import { IoMdExit } from "react-icons/io";

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
  const { watchId, setWatchId, setSharing } = useContext(AppContext);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [output, setOutput] = useState<string>("");
  const { socketRef } = useContext(SocketContext);
  const { codeRef } = useContext(AppContext);
  const [searchParam] = useSearchParams();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const watch = searchParam.get("watch");
    if (watch) {
      setSharing(false);
      setWatchId(watch);
    }
  }, [searchParam]);

  const handleLanguageSelect = (value: string) => {
    languages.forEach((lang) => {
      if (lang.lang === value) {
        setLanguage(() => lang);
      }
    });
  };

  const handleCodeSubmit = async () => {
    setSubmitting(true);
    runCode(codeRef.current, language.id, inputRef.current?.value)
      .then((res) => {
        console.log(codeRef.current);
        setOutput(() => {
          const errorType = `${res.data.message.status.description}`;
          const time = `Result in: ${res.data.message.time}s\n\n`;
          const out = res?.data.message.stdout
            ? `${res?.data.message.stdout}\n`
            : `${errorType}\n ${res?.data.message.stderr}\n`;
          const msg = res?.data.message.message || "";
          return time + out + msg;
        });
      })
      .catch((error) => {
        setOutput(() => {
          return `${Object.keys(error)[0]} ${Object.values(error)[0]}`;
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleCopy = () => {
    window.navigator.clipboard.writeText(codeRef.current);
    toast.success("Copied to clipboard");
  };

  const handleLeaveCodespace = () => {
    searchParams.delete("watch");
    setSearchParams(searchParams);
    setWatchId(null);
    setSharing(false);
    socketRef.current?.close();
    navigate("/codespace", { replace: true });

    // setWatchId(null);
    // setSharing(false);
    // socketRef.current?.close();
    // navigate("/codespace", { replace: true });
    // const newUrl = window.location.pathname;
    // window.history.replaceState({}, "", newUrl);
  };

  const languages = [
    { id: 102, lang: "Javascript" },
    { id: 1, lang: "HTML" },
    { id: 2, lang: "CSS" },
    { id: 105, lang: "CPP" },
    { id: 71, lang: "Python" },
    { id: 91, lang: "Java" },
  ];
  return (
    <main className="bg-neutral-900 w-full h-screen flex flex-col">
      <Navbar />
      <div className="w-full h-screen flex-1 pt-20 border-t border-zinc-700">
        <ResizablePanelGroup direction="horizontal" className="w-full h-full">
          <ResizablePanel className="p-2 flex flex-col gap-2" defaultSize={75}>
            <div className="flex  items-center pr-5 gap-5">
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
              {watchId && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="cursor-pointer bg-red-800 hover:bg-red-900 hover:text-zinc-300 text-zinc-300"
                        onClick={handleLeaveCodespace}
                      >
                        <IoMdExit />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Leave Codespace</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
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

          <ResizablePanel
            className="p-2 flex flex-col gap-2 items-start"
            defaultSize={25}
          >
            <Button
              className="cursor-pointer bg-green-800 hover:bg-green-900 hover:text-zinc-300 text-zinc-300"
              onClick={handleCodeSubmit}
              disabled={submitting}
            >
              {submitting && <Loader />}
              Run Code
            </Button>

            <Textarea
              placeholder="Output"
              value={output}
              readOnly
              className="w-full flex-1/2 resize-none overflow-auto border-2 border-white/10 focus-visible:border-white/10 focus-visible:ring-0 font-normal placeholder:text-muted-foreground text-white bg-[#1E1E1E] scrollbar-black"
            />
            <Textarea
              ref={inputRef}
              spellCheck={false}
              placeholder="Input"
              className="w-full h-full flex-1 resize-none overflow-auto border-2 border-white/10 focus-visible:border-white/10 focus-visible:ring-0 font-normal placeholder:text-muted-foreground text-white bg-[#1E1E1E] scrollbar-black"
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
};

export default CodeSpace;
