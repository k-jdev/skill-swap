"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type LoginFormData,
  type RegisterFormData,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
} from "@/features/auth/schemas";
import { createClient } from "@/shared/utils/supabase/server";
import { mapAuthError } from "@/shared/lib/authErrors";
import type { ActionResult } from "@/shared/types/action";

const INVALID_DATA = {
  success: false,
  error: "Please check the form and try again.",
  code: "validation_failed",
} as const;

export type LoginResult = { needsEmailConfirmation: false };
export type RegisterResult = { needsEmailConfirmation: boolean };

export async function loginAction(
  data: LoginFormData,
): Promise<ActionResult<LoginResult>> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) return INVALID_DATA;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { success: false, ...mapAuthError(error) };

  revalidatePath("/", "layout");
  return { success: true, data: { needsEmailConfirmation: false } };
}

export async function registerAction(
  data: RegisterFormData,
): Promise<ActionResult<RegisterResult>> {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) return INVALID_DATA;

  const supabase = await createClient();
  const { data: signUpData, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { username: parsed.data.name },
      emailRedirectTo: `${await getOrigin()}/auth/callback`,
    },
  });

  if (error) return { success: false, ...mapAuthError(error) };

  // The `profiles` row is created by the `handle_new_user` trigger
  // (supabase/migrations/0001_profiles_trigger_and_rls.sql), so signup stays
  // atomic and also covers OAuth / magic-link users.
  const needsEmailConfirmation = !signUpData.session;

  if (!needsEmailConfirmation) revalidatePath("/", "layout");
  return { success: true, data: { needsEmailConfirmation } };
}

export async function logoutAction(): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) return { success: false, ...mapAuthError(error) };

  revalidatePath("/", "layout");
  return { success: true, data: undefined };
}

export async function forgotPasswordAction(
  data: ForgotPasswordFormData,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(data);
  if (!parsed.success) return INVALID_DATA;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    { redirectTo: `${await getOrigin()}/auth/reset` },
  );

  // Rate limiting is the only failure worth reporting. Anything else would
  // reveal whether the address has an account.
  if (error && error.status === 429) {
    return { success: false, ...mapAuthError(error) };
  }

  return { success: true, data: undefined };
}

export async function resetPasswordAction(
  data: ResetPasswordFormData,
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(data);
  if (!parsed.success) return INVALID_DATA;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "This reset link expired. Request a new one.",
      code: "session_expired",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) return { success: false, ...mapAuthError(error) };

  revalidatePath("/", "layout");
  return { success: true, data: undefined };
}

async function getOrigin() {
  const headerList = await headers();
  const origin = headerList.get("origin");
  if (origin) return origin;

  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}
