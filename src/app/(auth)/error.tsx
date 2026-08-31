"use client";

import { useEffect } from "react";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-xl bg-white p-8 text-center shadow-xl">
      <h2 className="text-2xl font-bold text-black">Something went wrong</h2>
      <p className="mt-2 text-slate-600">
        We could not complete that request. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 cursor-pointer rounded-full bg-primary px-5 py-2 font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Retry
      </button>
    </div>
  );
}
