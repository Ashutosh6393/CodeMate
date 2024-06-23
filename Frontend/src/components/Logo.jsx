import React from "react";
import { logo } from "../images/images";

function Logo({ className = "" }) {
  return (
    <img className={`object-contain p-2 ${className}`} src={logo} alt="logo" />
  );
}

export default Logo;
