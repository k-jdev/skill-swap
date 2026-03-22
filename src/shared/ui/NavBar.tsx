"use client";
import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import NavButtons from "./NavButtons";
import Link from "next/link";
import useProfileStore from "../store/useProfileStore";
import {
  logoutUser,
  getCurrentUser,
} from "@/shared/utils/auth/services/auth.service";

export default function NavBar() {
  console.log(getCurrentUser());
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
                  className="absolute top-full right-0 mt-2 bg-white text-black p-3 rounded shadow-lg z-50 whitespace-nowrap"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
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
                  </div>
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
