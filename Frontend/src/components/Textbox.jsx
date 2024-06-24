import React from "react";
import { forwardRef } from "react";

function Textbox({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      {...props}
      className={`${className} resize-none h-full w-full text-white-0 p-2 text-base bg-bg-0 rounded-md focus:outline-none`}
    ></textarea>
  );
}

export default forwardRef(Textbox);
