import React from "react";
import Image from "next/image";
import NavButtons from "./NavButtons";
import Link from "next/link";
export default function NavBar() {
  return (
    <nav className="flex items-center justify-between py-4 px-5 border-b border-slate-200 ">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-10 cursor-pointer">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image
                src="/icons/rhombus.svg"
                alt="logo"
                width={32}
                height={32}
              />
              <p className="text-2xl text-black font-semibold">SkillSwap</p>
            </div>
          </Link>
          <div className="flex items-center">
            <ul className="flex justify-between gap-10 font-medium text-black">
              <li className="text-[#137fec]">
                <Link href="/browser">Browse</Link>
              </li>
              <li>How it works</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4">
          <Link href="/login">
            <NavButtons isLogin={true} text="Login" />
          </Link>
          <Link href="/register">
            <NavButtons text="Sign Up" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
