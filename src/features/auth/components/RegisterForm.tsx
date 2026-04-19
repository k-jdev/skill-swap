"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/shared/ui";
import Link from "next/link";
import { registerSchema } from "../schemas";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/utils/supabase/client";
import { toast } from "sonner";
import type { z } from "zod";

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { username: data.name } },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      router.push("/");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Server error, please try again");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-xl shadow-xl space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-center text-black">
          Create your account
        </h1>
        <p className="text-center">
          Join our community and start sharing your skills!
        </p>
      </div>
      <div className="space-y-6">
        <Input
          {...register("name")}
          error={errors.name?.message ?? null}
          type="text"
          placeholder="Name"
          label="Name"
          id="name"
        />
        <Input
          {...register("email")}
          error={errors.email?.message ?? null}
          type="email"
          placeholder="Email"
          label="Email"
          id="email"
        />
        <Input
          {...register("password")}
          error={errors.password?.message ?? null}
          type="password"
          placeholder="Password"
          label="Password"
          id="password"
        />
        <Input
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message ?? null}
          type="password"
          placeholder="Confirm Password"
          label="Confirm Password"
          id="confirm-password"
        />
      </div>
      {errors.root && (
        <p className="text-center text-red-500">{errors.root.message}</p>
      )}
      <Button disabled={isSubmitting}>
        {isSubmitting ? "Registering..." : "Register"}
      </Button>
      <p className="text-center font-medium">
        Already have an account?{" "}
        <Link href="/login" className="text-[#137fec] hover:text-[#137fec]/80">
          Log in
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
