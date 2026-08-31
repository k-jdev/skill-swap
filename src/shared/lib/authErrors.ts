import type { AuthError } from "@supabase/supabase-js";

/**
 * Supabase auth errors are mapped to generic, user-safe copy.
 *
 * Raw messages are never forwarded to the client: strings such as
 * "User already registered" let an attacker enumerate which e-mail
 * addresses have an account.
 */
const MESSAGES: Record<string, string> = {
  invalid_credentials: "Invalid email or password.",
  email_not_confirmed: "Confirm your email address before signing in.",
  user_already_exists: "Could not complete sign up. Try signing in instead.",
  email_exists: "Could not complete sign up. Try signing in instead.",
  weak_password: "This password is too weak. Use a longer, less common one.",
  over_request_rate_limit: "Too many attempts. Please try again in a minute.",
  over_email_send_rate_limit:
    "Too many emails sent. Please try again in a few minutes.",
  same_password: "The new password must differ from the current one.",
  session_expired: "Your session expired. Please sign in again.",
  validation_failed: "Please check the form and try again.",
};

export const GENERIC_AUTH_ERROR =
  "Something went wrong. Please try again in a moment.";

export function mapAuthError(error: AuthError): {
  error: string;
  code: string;
} {
  const code = error.code ?? (error.status === 429 ? "over_request_rate_limit" : "unknown");
  return { error: MESSAGES[code] ?? GENERIC_AUTH_ERROR, code };
}
