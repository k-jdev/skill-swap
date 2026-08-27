"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/shared/ui";
import { loginSchema } from "@/features/auth/schemas";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/utils/supabase/client";
import { toast } from "sonner";

import Link from "next/link";

import type { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Server error, please try again");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-xl shadow-xl space-y-6"
    >
      <div className="space-y-6">
        <Input
          {...register("email")}
          type="email"
          placeholder="Email"
          label="Email"
          id="email"
          error={errors.email?.message ?? null}
        />

        <Input
          {...register("password")}
          type="password"
          placeholder="Password"
          label="Password"
          id="password"
          error={errors.password?.message ?? null}
        />
      </div>

      {errors.root && (
        <p className="text-center text-red-500">{errors.root.message}</p>
      )}

      <Button disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>

      <p className="text-center font-medium">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-[#137fec] hover:text-[#137fec]/80"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
