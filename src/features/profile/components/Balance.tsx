"use client";

import React from "react";
import Link from "next/link";
import useProfileStore from "@/features/profile/model/useProfileStore";

/**
 * Credit balance panel. Only the profile owner sees their own wallet —
 * a visitor has no business knowing someone else's balance.
 */
function Balance() {
  const credits = useProfileStore((state) => state.credits);
  const isOwner = useProfileStore((state) => state.isOwner);

  if (!isOwner) return null;

  return (
    <section
      id="balance"
      aria-labelledby="balance-heading"
      className="border-b-2 border-slate-200 px-6 py-6 sm:px-10"
    >
      <h3 id="balance-heading" className="text-2xl font-bold">
        Balance
      </h3>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-primary-soft px-6 py-5">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            Available credits
          </p>
          <p className="text-4xl font-bold text-primary">{credits}</p>
          <p className="mt-1 text-sm text-slate-600">
            {credits === 0
              ? "Teach a skill to earn your first credits."
              : "Spend credits to book lessons from other members."}
          </p>
        </div>

        <Link
          href="/browser"
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Browse skills
        </Link>
      </div>
    </section>
  );
}

export default Balance;
