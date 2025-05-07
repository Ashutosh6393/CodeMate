import { AuthContext } from "../../context/AuthContext.tsx";
import { AppContext } from "../../context/AppContext.tsx";
import { Switch } from "@/components/ui/switch";
import { logout } from "../../lib/apiCalls.ts";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { BiSolidUser } from "react-icons/bi";
import { useNavigate } from "react-router";
import { FaRegEye } from "react-icons/fa";
import { Button } from "../ui/button.tsx";
import { useContext } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarLabel,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { toast } from "sonner";

type Props = {};

const Navbar: React.FC<Props> = () => {
  const { user, setUser } = useContext(AuthContext);
  const { sharing, setSharing, setAllowEdit, watchId, viewers } =
    useContext(AppContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    setUser(null);
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <nav className="absolute top-0 w-full bg-zinc-900 py-5 text-white px-10 flex justify-between items-center border-b border-zinc-600/50">
      <h1 className="text-3xl font-pp cursor-pointer">
        <span className="text-purple-800">C</span>ode
        <span className="text-purple-800">M</span>ate
      </h1>
      <div className="flex justify-center items-center gap-10">
        <Menubar className="bg-transparent border-0 text-white">
          {sharing || watchId ? (
            <MenubarMenu>
              {viewers.length}
              <MenubarTrigger className="cursor-pointer flex gap-2">
                <FaRegEye className="text-2xl text-green-300" />
              </MenubarTrigger>
            </MenubarMenu>
          ) : (
            ""
          )}
          <MenubarMenu>
            <MenubarTrigger className="cursor-pointer">
              <IoMdSettings className="text-2xl text-white hover:scale-110 hover:rotate-90 transition-all" />
            </MenubarTrigger>
            <MenubarContent className="p-2">
              <div className="flex justify-between items-center gap-2.5">
                <MenubarLabel className="text-zinc-700 text-sm  font-normal">
                  Allow other to edit
                </MenubarLabel>
                <Switch
                  disabled={!sharing}
                  className="cursor-pointer"
                  onCheckedChange={(checked: boolean) => setAllowEdit(checked)}
                />
              </div>
              <div className="flex justify-between items-center gap-2.5">
                <MenubarLabel className="text-zinc-700 text-sm  font-normal">
                  Live Share
                </MenubarLabel>
                <Switch
                  disabled={watchId ? true : false}
                  checked={sharing}
                  className="cursor-pointer"
                  onCheckedChange={(checked: boolean) => setSharing(checked)}
                />
              </div>
              <div className="flex justify-between items-center gap-2.5">
                <MenubarLabel className="text-zinc-700 text-sm  font-normal">
                  Invite Link
                </MenubarLabel>
                <Button
                  className={`p-0 text-zinc-600 hover:text-zinc-950 cursor-pointer`}
                  variant={"ghost"}
                  disabled={!sharing}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      window.location.href + "?watch=" + user?.userId
                    );
                    toast.message("Link copied to clipboard");
                  }}
                >
                  Copy
                </Button>
              </div>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="cursor-pointer">
              <BiSolidUser className="text-2xl text-white hover:scale-110 " />
            </MenubarTrigger>
            <MenubarContent className="flex flex-col ">
              <MenubarLabel className="text-zinc-700 text-sm  font-normal">
                {user && user.name.charAt(0).toUpperCase() + user.name.slice(1)}
              </MenubarLabel>
              <MenubarLabel className="text-zinc-700 text-sm  font-normal">
                {user?.email}
              </MenubarLabel>
              <Button className="mt-3 cursor-pointer" onClick={logoutHandler}>
                Logout
              </Button>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </nav>
  );
};

export default Navbar;
