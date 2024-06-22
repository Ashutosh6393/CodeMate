import React from "react";

function Button({
  children,
  handlerFunction,
  width='w-full',
  textColor = "text-bg-0",
  bgColor = "bg-primary",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      onClick={handlerFunction}
      type={type}
      className={`p-2 ${width} rounded-md ${textColor} ${bgColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
