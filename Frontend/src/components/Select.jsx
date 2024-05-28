import React from "react";
import { useAppContext } from "../context/appContext";

function Select() {
  const { setLanguage } = useAppContext();
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const options = ["javascript", "python", "java", "cpp"];
  return (
    <select onChange={handleLanguageChange} className="rounded-md p-2 text-bg-0 text-base w-full">
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
    </select>
  );
}

export default Select;
