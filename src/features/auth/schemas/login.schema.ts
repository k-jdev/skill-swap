import * as z from "zod";
import { emailSchema } from "./password.schema";

export const loginSchema = z.object({
  email: emailSchema,
  // Deliberately lax: the policy is enforced at sign-up, and rejecting an
  // existing (older, weaker) password here would lock legacy users out.
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
