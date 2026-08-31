"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutAction } from "@/features/auth";
import useSessionStore from "@/features/auth/model/useSessionStore";
import useProfileStore from "@/features/profile/model/useProfileStore";
import type { SessionUser } from "@/entities/session/model";

/**
 * Accessible account menu: a real button with `aria-expanded`, keyboard
 * support, Escape to close and click-outside dismissal. The previous
 * hover-only dropdown was unreachable without a mouse.
 */
export default function UserMenu({ user }: { user: SessionUser }) {
  const [open, setOpen] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const clearSession = useSessionStore((state) => state.clear);
  const resetProfile = useProfileStore((state) => state.reset);

  React.useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function handleLogout() {
    setIsSigningOut(true);
    const result = await logoutAction();

    if (!result.success) {
      toast.error(result.error);
      setIsSigningOut(false);
      return;
    }

    // Wipe every trace of the previous user before the tree re-renders.
    clearSession();
    resetProfile();
    setOpen(false);
    router.refresh();
    router.push("/");
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <Avatar user={user} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 grid w-56 gap-1 whitespace-nowrap rounded-xl border border-slate-200 bg-white p-2 text-black shadow-lg"
        >
          <div className="px-3 py-2">
            <p className="truncate font-semibold">{user.username || "User"}</p>
            <p className="truncate text-sm text-slate-500">{user.email}</p>
          </div>
          <hr className="border-slate-200" />

          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-50"
          >
            <PersonIcon />
            <span>My profile</span>
          </Link>

          <Link
            href="/profile#balance"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-50"
          >
            <WalletIcon />
            <span>Current balance</span>
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={isSigningOut}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
          >
            <Image src="/icons/exit.svg" alt="" width={20} height={20} aria-hidden />
            <span>{isSigningOut ? "Signing out..." : "Disconnect"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function Avatar({
  user,
  size = 40,
}: {
  user: Pick<SessionUser, "username" | "avatar_url">;
  size?: number;
}) {
  if (user.avatar_url) {
    return (
      <Image
        src={user.avatar_url}
        alt=""
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full bg-primary font-semibold text-white select-none"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {(user.username || "?").charAt(0).toUpperCase()}
    </div>
  );
}

function PersonIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6a2 2 0 0 1 2-2h13v4" />
      <path d="M3 6v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" />
      <path d="M21 8v4h-5a2 2 0 0 1 0-4h5z" />
    </svg>
  );
}
