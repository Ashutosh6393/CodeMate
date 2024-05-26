import React from "react";

function Select() {
  const options = ["javascript", "python", "java", "cpp"];
  return (
    <select className="rounded-md p-2 text-bg-0 text-base w-full">
        {options.map((option) => (
          <option value={option}>{option}</option>
        ))}
    </select>
  );
}

export default Select;
