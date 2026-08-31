"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui";

export default function GlobalError({
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
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="max-w-md text-slate-600">
        The page could not be loaded. Try again, and if it keeps happening come
        back in a few minutes.
      </p>
      <Button fullWidth={false} onClick={reset} type="button">
        Try again
      </Button>
    </main>
  );
}
