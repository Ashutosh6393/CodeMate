import { SettingContext } from "../../context/SettingContext.tsx";
import { AuthContext } from "../../context/AuthContext.tsx";
import { Switch } from "@/components/ui/switch";
import { IoMdSettings } from "react-icons/io";
import { BiSolidUser } from "react-icons/bi";
import { Button } from "../ui/button.tsx";
import { useContext } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarLabel,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

type Props = {};

const Navbar: React.FC<Props> = () => {
  const { user } = useContext(AuthContext);
  const { sharing, setSharing, setAllowEdit } =
    useContext(SettingContext);

  return (
    <nav className="absolute top-0 w-full bg-zinc-900 py-5 text-white px-10 flex justify-between items-center">
      <h1 className="text-3xl font-pp cursor-pointer">
        <span className="text-purple-800">C</span>ode
        <span className="text-purple-800">M</span>ate
      </h1>
      <div className="flex justify-center items-center gap-10">
        <Menubar className="bg-transparent border-0 text-white">
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
                  className="cursor-pointer"
                  onCheckedChange={(checked: boolean) => setAllowEdit(checked)}
                />
              </div>
              <div className="flex justify-between items-center gap-2.5">
                <MenubarLabel className="text-zinc-700 text-sm  font-normal">
                  Live Share
                </MenubarLabel>
                <Switch
                  className="cursor-pointer"
                  onCheckedChange={(checked: boolean) => setSharing(checked)}
                />
              </div>
              <div className="flex justify-between items-center gap-2.5">
                <MenubarLabel className="text-zinc-700 text-sm  font-normal">
                  Invite Link
                </MenubarLabel>
                <Button
                  className="p-0 text-zinc-600 hover:text-zinc-950 cursor-pointer"
                  variant={"ghost"}
                  disabled={!sharing}
                  onClick={() => {
                    console.log(sharing);
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
              <Button className="mt-3 cursor-pointer">Logout</Button>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </nav>
  );
};

export default Navbar;
