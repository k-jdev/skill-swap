import React from "react";
import { ForgotPasswordForm, HeaderBlock } from "@/features/auth";
import { createMetadata } from "@/shared/lib/createMetadata";

export const metadata = createMetadata(
  "Forgot password",
  "Reset your SkillSwap password",
);

export default function ForgotPasswordPage() {
  return (
    <>
      <HeaderBlock
        title="Forgot your password?"
        subtitle="We'll email you a link to choose a new one."
      />
      <ForgotPasswordForm />
    </>
  );
}
