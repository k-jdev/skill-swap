"use client";

import { useEffect } from "react";

export default function SegmentError({
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
    <div className="mx-auto mt-10 w-full max-w-6xl rounded-4xl bg-white p-10 text-center shadow-md">
      <h2 className="text-2xl font-bold">This section failed to load</h2>
      <p className="mt-2 text-slate-600">We could not load this skill right now.</p>
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
