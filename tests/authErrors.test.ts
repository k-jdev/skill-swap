import { describe, it, expect } from "vitest";
import type { AuthError } from "@supabase/supabase-js";
import { mapAuthError, GENERIC_AUTH_ERROR } from "@/shared/lib/authErrors";

function authError(partial: Partial<AuthError>): AuthError {
  return {
    name: "AuthApiError",
    message: partial.message ?? "raw supabase message",
    status: partial.status,
    code: partial.code,
  } as AuthError;
}

describe("mapAuthError", () => {
  it("maps known codes to user-facing copy", () => {
    expect(mapAuthError(authError({ code: "invalid_credentials" }))).toEqual({
      error: "Invalid email or password.",
      code: "invalid_credentials",
    });

    expect(mapAuthError(authError({ code: "email_not_confirmed" })).error).toBe(
      "Confirm your email address before signing in.",
    );
  });

  it("never reveals whether an email is already registered", () => {
    // "User already registered" would let an attacker enumerate accounts.
    for (const code of ["user_already_exists", "email_exists"]) {
      const mapped = mapAuthError(
        authError({ code, message: "User already registered" }),
      );
      expect(mapped.error).toBe(
        "Could not complete sign up. Try signing in instead.",
      );
      expect(mapped.error).not.toContain("already registered");
    }
  });

  it("falls back to generic copy for unknown codes", () => {
    const mapped = mapAuthError(
      authError({ code: "some_future_code", message: "internal detail leak" }),
    );
    expect(mapped.error).toBe(GENERIC_AUTH_ERROR);
  });

  it("never forwards the raw Supabase message", () => {
    const raw = "Database error saving new user: relation does not exist";
    const mapped = mapAuthError(authError({ message: raw }));
    expect(mapped.error).not.toContain("relation");
    expect(mapped.error).toBe(GENERIC_AUTH_ERROR);
  });

  it("treats HTTP 429 without a code as rate limiting", () => {
    const mapped = mapAuthError(authError({ status: 429 }));
    expect(mapped.code).toBe("over_request_rate_limit");
    expect(mapped.error).toBe("Too many attempts. Please try again in a minute.");
  });
});
