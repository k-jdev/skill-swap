import React from "react";
import Image from "next/image";

function HeaderBlock() {
  return (
    <div className="flex flex-col items-center mb-8 space-y-2">
      <Image
        src="/icons/rhombus.svg"
        alt="Header Image"
        width={48}
        height={48}
      />
      <div className="flex flex-col items-center">
        {" "}
        <h1 className="text-3xl font-bold text-black">
          Welcome back to SkillSwap
        </h1>
        <p className="text-[#64748b]">
          Enter your credentials to access your account.
        </p>
      </div>
    </div>
  );
}

export default HeaderBlock;
