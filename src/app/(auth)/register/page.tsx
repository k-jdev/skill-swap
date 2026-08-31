import React from "react";
import { RegisterForm, HeaderBlock } from "@/features/auth";
import { createMetadata } from "@/shared/lib/createMetadata";

export const metadata = createMetadata(
  "Register",
  "Create your SkillSwap account",
);

export default function RegisterPage() {
  return (
    <>
      <HeaderBlock
        title="Create your account"
        subtitle="Join our community and start sharing your skills!"
      />
      <RegisterForm />
    </>
  );
}
