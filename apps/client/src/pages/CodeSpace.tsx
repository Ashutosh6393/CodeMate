import MonacoEditor from "../components/layout/MonacoEditor";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import { useNavigate, useSearchParams } from "react-router";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/layout/Navbar";
import { Button } from "../components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Loader from "../components/common/Loader";
import { runCode } from "../lib/apiCalls";
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
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [output, setOutput] = useState<string>("");
  const { socketRef } = useContext(SocketContext);
  const { codeRef } = useContext(AppContext);
  const [searchParam] = useSearchParams();
  const navigate = useNavigate();

  const {
    watchId,
    monacoRef,
    setWatchId,
    setSharing,
    setEditorDisabled,
    isMonacoReady,
    language,
    setLanguage,
  } = useContext(AppContext);

  const handleLanguageSelect = (value: string) => {
    languages.forEach((lang) => {
      if (lang.lang === value) {
        setLanguage(() => lang);
      }
    });
  };

  const handleCodeSubmit = async () => {
    setSubmitting(true);
    const latestCode = monacoRef.current?.editor.getEditors()[0]?.getValue();
    runCode(latestCode!, language.id, inputRef.current?.value)
      .then((res) => {
        if (res) {
          setOutput(() => {
            let output = "";
            if (res.data.data.time) {
              output += "Result in: " + res.data.data.time + "\n";
            }
            if (res.data.data.stdout) {
              output += res.data.data.stdout + "\n";
            }
            if (res.data.data.stderr) {
              output += res.data.data.stderr + "\n";
            }
            if (res.data.data.compileOutput) {
              output += res.data.data.compileOutput + "\n";
            }
            if (res.data.data.message) {
              output += res.data.data.message + "\n";
            }

            return output;
          });
        }
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
    monacoRef.current?.editor.getEditors()[0]?.setValue("");

    navigate("/codespace", { replace: true });
  };

  useEffect(() => {
    const watch = searchParam.get("watch");
    if (watch && isMonacoReady) {
      setSharing(false);
      setWatchId(watch);
      setEditorDisabled(true);
    } else {
      setEditorDisabled(false);
    }
  }, [searchParam, isMonacoReady]);

  const languages = [
    { id: 102, lang: "Javascript" },
    { id: 1, lang: "HTML" },
    { id: 2, lang: "CSS" },
    { id: 105, lang: "CPP" },
    { id: 71, lang: "Python" },
    { id: 91, lang: "Java" },
  ];

  const windowWidth = window.innerWidth;
  console.log(windowWidth);
  return (
    <main className="bg-neutral-900 w-full h-dvh flex flex-col">
      <Navbar />
      <div className="w-full h-svh flex-1 pt-20 border-t border-zinc-700">
        <ResizablePanelGroup
          direction={windowWidth > 890 ? "horizontal" : "vertical"}
          className="w-full h-full"
        >
          <ResizablePanel
            className="p-2 flex flex-col gap-2"
            defaultSize={windowWidth > 890 ? 75 : 50}
          >
            <div className="flex items-center pr-5 gap-5">
              <Select
                onValueChange={handleLanguageSelect}
                value={language.lang}
              >
                <SelectTrigger className="cursor-pointer w-30 focus-visible:ring-0 text-white data-[placeholder]:text-white  font-semibold border border-zinc-700 bg-zinc-900 ">
                  <SelectValue
                    placeholder={language.lang}
                    defaultValue={language.lang}
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

          <ResizableHandle
            className={windowWidth > 890 ? "bg-zinc-700/50" : "bg-zinc-400"}
            accessKey="horizontal"
          />

          <ResizablePanel
            className="p-2 flex flex-col gap-2 items-start"
            defaultSize={25}
          >
            <Button
              className="cursor-pointer bg-green-800 hover:bg-green-900 hover:text-zinc-300 text-zinc-300"
              onClick={handleCodeSubmit}
              disabled={
                submitting || language.id == 1 || language.id == 2
                  ? true
                  : false
              }
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
