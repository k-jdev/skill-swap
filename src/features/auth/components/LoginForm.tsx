"use client";
import React, { useRef, useState } from "react";
import { Button, Input } from "@/shared/ui";
import useProfileStore from "@/shared/store/useProfileStore";

import Link from "next/link";
import { loginSchema } from "@/features/auth/schemas";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
//TODO: rewrite this on react-hook-form
function LoginForm() {
  const router = useRouter();
  const {
    setIsAuthenticated,
    setName,
    setEmail: setStoreEmail,
  } = useProfileStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const focusFirstError = (errs: { email?: string; password?: string }) => {
    if (errs.email) {
      emailRef.current?.focus();
    } else if (errs.password) {
      passwordRef.current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const input = { email: email.trim(), password };
    const result = loginSchema.safeParse(input);

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      const newErrors: { email?: string; password?: string } = {};
      if (fieldErrors.email && fieldErrors.email.length)
        newErrors.email = fieldErrors.email[0];
      if (fieldErrors.password && fieldErrors.password.length)
        newErrors.password = fieldErrors.password[0];
      setErrors(newErrors);
      focusFirstError(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrors({ form: error.message });
        return;
      }

      const userName =
        authData.user?.user_metadata?.username || email.split("@")[0];
      setName(userName);
      setStoreEmail(email);
      setIsAuthenticated(true);

      router.push("/");
    } catch (err) {
      setErrors({ form: "Server error, please try again" });
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-xl space-y-6"
    >
      <div className="space-y-6">
        <Input
          ref={emailRef}
          type="email"
          placeholder="Email"
          label="Email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email ?? null}
        />

        <Input
          ref={passwordRef}
          type="password"
          placeholder="Password"
          label="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password ?? null}
        />
      </div>

      {errors.form && <p className="text-center text-red-500">{errors.form}</p>}

      <Button>{isSubmitting ? "Logging in..." : "Login"}</Button>

      <p className="text-center font-medium ">
        Don&apos;t have an account?{" "}
        <span className="text-[#137fec] cursor-pointer hover:text-[#137fec]/80">
          <Link href="/register">Sign up</Link>
        </span>
      </p>
    </form>
  );
}

export default LoginForm;
