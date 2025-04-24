import { IoMdSettings } from "react-icons/io";
import { BiSolidUser } from "react-icons/bi";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <nav className="w-full bg-zinc-900 py-5 text-white px-10 flex justify-between items-center">
      <h1 className="text-3xl font-pp">
        <span className="text-purple-800">C</span>ode
        <span className="text-purple-800">M</span>ate
      </h1>
      <div className="flex justify-center items-center gap-10">
        <IoMdSettings className="text-2xl text-white hover:scale-110 hover:rotate-90 transition-all" />
        <BiSolidUser className="text-2xl text-white hover:scale-110 " />
      </div>
    </nav>
  );
};

export default Navbar;
