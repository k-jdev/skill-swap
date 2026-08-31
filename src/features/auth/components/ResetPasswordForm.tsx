"use client";

import React from "react";
import { Button, PasswordInput } from "@/shared/ui";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/features/auth/schemas";
import { resetPasswordAction } from "@/features/auth/actions";
import { useAuthForm } from "@/features/auth/model/useAuthForm";

function ResetPasswordForm() {
  const {
    register,
    onSubmit,
    isSubmitting,
    formState: { errors },
  } = useAuthForm<ResetPasswordFormData, void>({
    schema: resetPasswordSchema,
    action: resetPasswordAction,
    defaultValues: { password: "", confirmPassword: "" },
    redirectTo: "/",
    successMessage: "Password updated.",
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-6 rounded-xl bg-white p-8 shadow-xl"
    >
      <PasswordInput
        {...register("password")}
        autoComplete="new-password"
        placeholder="New password"
        label="New password"
        id="password"
        required
        hint="At least 8 characters, including a letter and a number."
        error={errors.password?.message ?? null}
      />
      <PasswordInput
        {...register("confirmPassword")}
        autoComplete="new-password"
        placeholder="Confirm new password"
        label="Confirm new password"
        id="confirm-password"
        required
        error={errors.confirmPassword?.message ?? null}
      />

      {errors.root && (
        <p role="alert" className="text-center text-red-600">
          {errors.root.message}
        </p>
      )}

      <Button isLoading={isSubmitting}>
        {isSubmitting ? "Saving..." : "Set new password"}
      </Button>
    </form>
  );
}

export default ResetPasswordForm;
