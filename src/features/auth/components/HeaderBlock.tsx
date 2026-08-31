import React from "react";
import Image from "next/image";

type Props = {
  title?: string;
  subtitle?: string;
};

function HeaderBlock({
  title = "Welcome back to SkillSwap",
  subtitle = "Enter your credentials to access your account.",
}: Props) {
  return (
    <div className="mb-8 flex flex-col items-center space-y-2">
      <Image src="/icons/rhombus.svg" alt="" width={48} height={48} aria-hidden />
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold text-black">{title}</h1>
        <p className="text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

export default HeaderBlock;
