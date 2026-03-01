"use server";

import { loginSchema, registerSchema } from "@/features/auth/schemas";
import { createClient } from "@/shared/utils/supabase/server";

import type { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export async function loginAction(data: LoginFormData) {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid data" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) return { error: error.message };
  return { error: null };
}

export async function registerAction(data: RegisterFormData) {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid data" };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        username: parsed.data.name,
      },
    },
  });
  if (error) return { error: error.message };
  return { error: null };
}
