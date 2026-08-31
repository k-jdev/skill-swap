"use client";

import React from "react";
import Link from "next/link";
import { Button, Input, PasswordInput } from "@/shared/ui";
import { registerSchema, type RegisterFormData } from "@/features/auth/schemas";
import { registerAction } from "@/features/auth/actions";
import { useAuthForm } from "@/features/auth/model/useAuthForm";

function RegisterForm() {
  const [awaitingConfirmation, setAwaitingConfirmation] = React.useState<
    string | null
  >(null);

  const {
    register,
    onSubmit,
    isSubmitting,
    getValues,
    formState: { errors },
  } = useAuthForm<RegisterFormData, { needsEmailConfirmation: boolean }>({
    schema: registerSchema,
    action: registerAction,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    // Staying on the page when a confirmation email is pending is the whole
    // point: pushing to "/" would pretend the user is signed in.
    redirectTo: (data) => (data.needsEmailConfirmation ? null : "/"),
    successMessage: (data) =>
      data.needsEmailConfirmation ? null : "Account created. Welcome!",
    onSuccess: (data) => {
      if (data.needsEmailConfirmation) {
        setAwaitingConfirmation(getValues("email"));
      }
    },
  });

  if (awaitingConfirmation) {
    return (
      <div className="space-y-4 rounded-xl bg-white p-8 text-center shadow-xl">
        <h1 className="text-2xl font-bold text-black">Check your inbox</h1>
        <p className="text-slate-600">
          We sent a confirmation link to{" "}
          <span className="font-medium text-black">{awaitingConfirmation}</span>.
          Open it to activate your account.
        </p>
        <p className="text-sm text-slate-500">
          Nothing arrived? Check your spam folder, then try registering again.
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
      <div className="space-y-6">
        <Input
          {...register("name")}
          error={errors.name?.message ?? null}
          type="text"
          autoComplete="name"
          placeholder="Name"
          label="Name"
          id="name"
          required
        />
        <Input
          {...register("email")}
          error={errors.email?.message ?? null}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email"
          label="Email"
          id="email"
          required
        />
        <PasswordInput
          {...register("password")}
          error={errors.password?.message ?? null}
          autoComplete="new-password"
          placeholder="Password"
          label="Password"
          id="password"
          required
          hint="At least 8 characters, including a letter and a number."
        />
        <PasswordInput
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message ?? null}
          autoComplete="new-password"
          placeholder="Confirm Password"
          label="Confirm Password"
          id="confirm-password"
          required
        />
      </div>

      {errors.root && (
        <p role="alert" className="text-center text-red-600">
          {errors.root.message}
        </p>
      )}

      <Button isLoading={isSubmitting}>
        {isSubmitting ? "Registering..." : "Register"}
      </Button>

      <p className="text-center font-medium">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:text-primary-hover">
          Log in
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
