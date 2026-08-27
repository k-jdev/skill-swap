"use client";
import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import NavButtons from "./NavButtons";
import Link from "next/link";
import useProfileStore from "../../features/profile/model/useProfileStore";
import { logoutUser } from "@/features/auth/api/auth.service";

export default function NavBar() {
  const { isAuthenticated, avatar_url, username, setProfile } =
    useProfileStore();
  const [isHovered, setIsHovered] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimeout.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  }, []);

  return (
    <nav className="flex items-center justify-between py-4 px-5 border-b border-slate-200 bg-white">
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
            <ul className="flex justify-between gap-10 font-medium text-black ">
              <li className="hover:text-[#137fec]">
                <Link href="/browser">Browse</Link>
              </li>
              <li className="hover:text-[#137fec]">
                <Link href="/how-it-works">How it works</Link>
              </li>
              <li className="hover:text-[#137fec]">
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4">
          {isAuthenticated ? (
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/profile">
                {avatar_url ? (
                  <img
                    src={avatar_url}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold cursor-pointer">
                    {username.charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>

              {isHovered && (
                <div
                  className="absolute top-full right-0 mt-2 bg-white text-black p-3 rounded shadow-lg grid gap-2 z-50 whitespace-nowrap"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="flex items-center gap-2">
                    <WalletIcon />
                    <p>Current balance</p>
                  </button>
                  <button
                    className="flex items-center gap-2 pr-6 cursor-pointer"
                    onClick={async () => {
                      const { error } = await logoutUser();
                      if (!error) {
                        setProfile({
                          isAuthenticated: false,
                          avatar_url: "",
                          username: "",
                        });
                      }
                    }}
                  >
                    <Image
                      src="/icons/exit.svg"
                      alt="exit"
                      width={24}
                      height={24}
                    />
                    <p>Disconnect</p>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">
                <NavButtons isLogin={true} text="Login" />
              </Link>
              <Link href="/register">
                <NavButtons text="Sign Up" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function WalletIcon() {
  return (
    <svg
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 16V16V16V16V16V16V16V16V2V2V2V2V2V2V2V2C2 2 2 2.37083 2 3.1125C2 3.85417 2 4.81667 2 6V12C2 13.1833 2 14.1458 2 14.8875C2 15.6292 2 16 2 16V16M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V4.5H16V2V2V2H2V2V2V16V16V16H16V16V16V13.5H18V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2V18M10 14C9.45 14 8.97917 13.8042 8.5875 13.4125C8.19583 13.0208 8 12.55 8 12V6C8 5.45 8.19583 4.97917 8.5875 4.5875C8.97917 4.19583 9.45 4 10 4H17C17.55 4 18.0208 4.19583 18.4125 4.5875C18.8042 4.97917 19 5.45 19 6V12C19 12.55 18.8042 13.0208 18.4125 13.4125C18.0208 13.8042 17.55 14 17 14H10V14M17 12V12V12V6V6V6H10V6V6V12V12V12H17V12M13 10.5C13.4167 10.5 13.7708 10.3542 14.0625 10.0625C14.3542 9.77083 14.5 9.41667 14.5 9C14.5 8.58333 14.3542 8.22917 14.0625 7.9375C13.7708 7.64583 13.4167 7.5 13 7.5C12.5833 7.5 12.2292 7.64583 11.9375 7.9375C11.6458 8.22917 11.5 8.58333 11.5 9C11.5 9.41667 11.6458 9.77083 11.9375 10.0625C12.2292 10.3542 12.5833 10.5 13 10.5V10.5"
        fill="#005EB5"
      ></path>
    </svg>
  );
}
