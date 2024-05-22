import React, { forwardRef } from "react";

function Input(
  { label, type = "text", width = "w-full", className = "", ...props },
  ref
) {
  return (
    <div className={` ${width} flex flex-col justify-start items-start`}>
      <input type={type} className={`w-full p-2 rounded-md bg-bg-1 border-2 border-white-0  focus:outline-primary ${className}`} ref={ref} {...props} />
    </div>
  );
}

export default forwardRef(Input);
