"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, Input, PasswordInput } from "@/shared/ui";
import { loginSchema, type LoginFormData } from "@/features/auth/schemas";
import { loginAction } from "@/features/auth/actions";
import { useAuthForm } from "@/features/auth/model/useAuthForm";
import { safeRedirect, redirectParam } from "@/shared/config/routes";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get(redirectParam)) ?? "/";

  const {
    register,
    onSubmit,
    isSubmitting,
    formState: { errors },
  } = useAuthForm<LoginFormData, { needsEmailConfirmation: false }>({
    schema: loginSchema,
    action: loginAction,
    defaultValues: { email: "", password: "" },
    redirectTo,
    successMessage: "Welcome back!",
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-6 rounded-xl bg-white p-8 shadow-xl"
    >
      <div className="space-y-6">
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

        <PasswordInput
          {...register("password")}
          autoComplete="current-password"
          placeholder="Password"
          label="Password"
          id="password"
          required
          error={errors.password?.message ?? null}
        />
      </div>

      <div className="text-right">
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-primary hover:text-primary-hover"
        >
          Forgot password?
        </Link>
      </div>

      {errors.root && (
        <p role="alert" className="text-center text-red-600">
          {errors.root.message}
        </p>
      )}

      <Button isLoading={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>

      <p className="text-center font-medium">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary hover:text-primary-hover"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
