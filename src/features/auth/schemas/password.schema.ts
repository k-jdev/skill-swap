import * as z from "zod";

/** Shared password policy. 72 bytes is the bcrypt limit Supabase enforces. */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(72, "Password must be at most 72 characters long")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

/** Emails are normalised so `A@B.com` and `a@b.com` are the same account. */
export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .toLowerCase()
  .pipe(z.email("Invalid email address"));
