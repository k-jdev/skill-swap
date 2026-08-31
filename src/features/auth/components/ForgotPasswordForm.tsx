"use client";

import React from "react";
import Link from "next/link";
import { Button, Input } from "@/shared/ui";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/features/auth/schemas";
import { forgotPasswordAction } from "@/features/auth/actions";
import { useAuthForm } from "@/features/auth/model/useAuthForm";

function ForgotPasswordForm() {
  const [sentTo, setSentTo] = React.useState<string | null>(null);

  const {
    register,
    onSubmit,
    isSubmitting,
    getValues,
    formState: { errors },
  } = useAuthForm<ForgotPasswordFormData, void>({
    schema: forgotPasswordSchema,
    action: forgotPasswordAction,
    defaultValues: { email: "" },
    redirectTo: null,
    onSuccess: () => setSentTo(getValues("email")),
  });

  if (sentTo) {
    return (
      <div className="space-y-4 rounded-xl bg-white p-8 text-center shadow-xl">
        <h1 className="text-2xl font-bold text-black">Check your inbox</h1>
        <p className="text-slate-600">
          If an account exists for{" "}
          <span className="font-medium text-black">{sentTo}</span>, a reset link
          is on its way.
        </p>
        <Link
          href="/login"
          className="inline-block font-medium text-primary hover:text-primary-hover"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-6 rounded-xl bg-white p-8 shadow-xl"
    >
      <Input
        {...register("email")}
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="Email"
        label="Email"
        id="email"
        required
        error={errors.email?.message ?? null}
      />

      {errors.root && (
        <p role="alert" className="text-center text-red-600">
          {errors.root.message}
        </p>
      )}

      <Button isLoading={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send reset link"}
      </Button>

      <p className="text-center font-medium">
        Remembered it?{" "}
        <Link href="/login" className="text-primary hover:text-primary-hover">
          Log in
        </Link>
      </p>
    </form>
  );
}

export default ForgotPasswordForm;
