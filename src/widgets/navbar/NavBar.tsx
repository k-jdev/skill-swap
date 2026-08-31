"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";
import NavButtons from "./NavButtons";
import useSessionStore from "@/features/auth/model/useSessionStore";

const LINKS = [
  { href: "/browser", label: "Browse" },
  { href: "/how-it-works", label: "How it works" },
];

export default function NavBar() {
  const user = useSessionStore((state) => state.user);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icons/rhombus.svg" alt="" width={32} height={32} aria-hidden />
            <span className="text-2xl font-semibold text-black">SkillSwap</span>
          </Link>

          <ul className="hidden items-center gap-10 font-medium text-black md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className="hover:text-primary aria-[current=page]:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden gap-4 sm:flex">
              <Link href="/login">
                <NavButtons isLogin text="Login" />
              </Link>
              <Link href="/register">
                <NavButtons text="Sign Up" />
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation"
            className="cursor-pointer rounded-lg p-2 text-black md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <BurgerIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-nav" className="border-t border-slate-200 md:hidden">
          <ul className="flex flex-col gap-1 px-4 py-3 font-medium text-black">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-2 py-2 hover:bg-slate-50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {!user && (
              <>
                <li>
                  <Link
                    href="/login"
                    className="block rounded-lg px-2 py-2 hover:bg-slate-50"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="block rounded-lg px-2 py-2 text-primary hover:bg-slate-50"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      {open ? (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      ) : (
        <>
          <path d="M3 6h18" />
          <path d="M3 12h18" />
          <path d="M3 18h18" />
        </>
      )}
    </svg>
  );
}
