import React from "react";

function Button({ children, handlerFunction, textColor = "text-bg-0", bgColor= "bg-primary", className = "", type="button"}) {
  return (
    <button onClick={handlerFunction} type={type} className={`p-2 w-full rounded-md ${textColor} ${bgColor} ${className}`}>
      {children}
    </button>
  );
}

export default Button;
