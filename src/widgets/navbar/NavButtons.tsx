import React from "react";

type Props = { isLogin?: boolean; text?: string };

export default function NavButtons({ isLogin, text }: Props) {
  return (
    <div className="">
      {isLogin ? (
        <button className="flex items-center justify-center  rounded-full py-2 px-4 bg-primary/10 text-primary cursor-pointer">
          {text}
        </button>
      ) : (
        <button className="flex items-center justify-center  rounded-full py-2 px-4 bg-primary text-white cursor-pointer">
          {text}
        </button>
      )}
    </div>
  );
}
