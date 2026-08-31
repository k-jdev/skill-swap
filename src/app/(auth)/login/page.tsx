import React, { Suspense } from "react";
import { LoginForm, HeaderBlock } from "@/features/auth";
import { createMetadata } from "@/shared/lib/createMetadata";

export const metadata = createMetadata("Login", "Sign in to SkillSwap");

export default function LoginPage() {
  return (
    <>
      <HeaderBlock />
      {/* LoginForm reads `?redirectTo=`, so it needs a Suspense boundary. */}
      <Suspense fallback={<div className="h-[420px] rounded-xl bg-white shadow-xl" />}>
        <LoginForm />
      </Suspense>
    </>
  );
}
