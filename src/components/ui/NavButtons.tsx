import React from "react";

type Props = { isLogin?: boolean; text?: string };

export default function NavButtons({ isLogin, text }: Props) {
  return (
    <div className="">
      {isLogin ? (
        <button className="flex items-center justify-center  rounded-full py-2 px-4 bg-[#137fec]/10 text-[#137fec] cursor-pointer">
          {text}
        </button>
      ) : (
        <button className="flex items-center justify-center  rounded-full py-2 px-4 bg-[#137fec] text-white cursor-pointer">
          {text}
        </button>
      )}
    </div>
  );
}
