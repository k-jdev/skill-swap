import React from "react";
import Link from "next/link";
import { ResetPasswordForm, HeaderBlock } from "@/features/auth";
import { createMetadata } from "@/shared/lib/createMetadata";
import { createClient } from "@/shared/utils/supabase/server";

export const metadata = createMetadata(
  "Reset password",
  "Choose a new SkillSwap password",
);

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Reaching this page without a recovery session means the link expired or
  // was already used — say so instead of showing a form that cannot submit.
  if (!user) {
    return (
      <>
        <HeaderBlock
          title="Link expired"
          subtitle="This password reset link is no longer valid."
        />
        <div className="rounded-xl bg-white p-8 text-center shadow-xl">
          <Link
            href="/forgot-password"
            className="font-medium text-primary hover:text-primary-hover"
          >
            Request a new link
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderBlock
        title="Choose a new password"
        subtitle="Pick something you have not used before."
      />
      <ResetPasswordForm />
    </>
  );
}
