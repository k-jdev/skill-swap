import React from "react";
import Image from "next/image";
import ButtonProps from "../types/button";

export default function Button({
  text,
  className,
  onClick,
  children,
  disabled,
  icon,
}: ButtonProps) {
  return (
    <div className={`flex gap-2 justify-between items-center ${className}`}>
      {icon && <Image src={icon} sizes="w-2" alt="" />}
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full bg-[#137fec] cursor-pointer text-white font-bold py-3 px-4 rounded-[1rem] hover:bg-[#137fec]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#137fec] focus:ring-offset-[#0d141b] dark:focus:ring-offset-[#101922] transition-colors duration-300 ${className}`}
        type="submit"
      >
        {children || text || "Login"}
      </button>
    </div>
  );
}
