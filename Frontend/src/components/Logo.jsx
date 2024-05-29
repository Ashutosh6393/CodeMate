import React from "react";
import { logo } from "../images/images";

function Logo({ className = "" }) {
  return (
    <img className={`w-full h-full p-2 ${className}`} src={logo} alt="logo" />
  );
}

export default Logo;
