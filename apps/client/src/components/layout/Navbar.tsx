import { IoMdSettings } from "react-icons/io";
import { BiSolidUser } from "react-icons/bi";
import { Switch } from "@/components/ui/switch";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.tsx";

import {
  Menubar,
  MenubarContent,
  MenubarLabel,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Button } from "../ui/button.tsx";

type Props = {};

const Navbar = (props: Props) => {
  const {user} = useContext(AuthContext);
  return (
    <nav className="w-full bg-zinc-900 py-5 text-white px-10 flex justify-between items-center">
      <h1 className="text-3xl font-pp">
        <span className="text-purple-800">C</span>ode
        <span className="text-purple-800">M</span>ate
      </h1>
      <div className="flex justify-center items-center gap-10">
        <Menubar className="bg-transparent border-0 text-white">
          <MenubarMenu>
            <MenubarTrigger>
              <IoMdSettings className="text-2xl text-white hover:scale-110 hover:rotate-90 transition-all" />
            </MenubarTrigger>
            <MenubarContent className="p-2">
              <div className="flex justify-between items-center gap-2.5">
                <MenubarLabel className="text-zinc-700 text-sm  font-normal">
                  Allow other to edit
                </MenubarLabel>
                <Switch />
              </div>
              <div className="flex justify-between items-center gap-2.5">
                <MenubarLabel className="text-zinc-700 text-sm  font-normal">
                  Live Share
                </MenubarLabel>
                <Switch />
              </div>
              <div className="flex justify-between items-center gap-2.5">
                <MenubarLabel className="text-zinc-700 text-sm  font-normal">
                  Invite Link
                </MenubarLabel>
                <Button
                  className="p-0 text-zinc-600 hover:text-zinc-950"
                  variant={"ghost"}
                >
                  Copy
                </Button>
              </div>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>
              <BiSolidUser className="text-2xl text-white hover:scale-110 " />
            </MenubarTrigger>
            <MenubarContent className="flex flex-col ">
              <MenubarLabel className="text-zinc-700 text-sm  font-normal">
                {user && (user.name.charAt(0).toUpperCase()+ user.name.slice(1))}
              </MenubarLabel>
              <MenubarLabel className="text-zinc-700 text-sm  font-normal">
                {user?.email}
              </MenubarLabel>
              <Button className="mt-3">Logout</Button>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </nav>
  );
};

export default Navbar;
