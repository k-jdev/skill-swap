import { describe, it, expect } from "vitest";
import {
  emailSchema,
  passwordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/features/auth/schemas";

/** First error message for a failing parse, or null when it succeeds. */
function firstError(schema: { safeParse: (v: unknown) => unknown }, value: unknown) {
  const result = schema.safeParse(value) as
    | { success: true }
    | { success: false; error: { issues: { message: string }[] } };
  return result.success ? null : result.error.issues[0].message;
}

describe("emailSchema", () => {
  it("normalises casing and surrounding whitespace", () => {
    // Prevents duplicate accounts for `A@B.com` and `a@b.com`.
    expect(emailSchema.parse("  A@B.COM  ")).toBe("a@b.com");
  });

  it("reports a missing email as required, not as malformed", () => {
    expect(firstError(emailSchema, "")).toBe("Email is required");
    expect(firstError(emailSchema, "   ")).toBe("Email is required");
  });

  it("rejects malformed addresses with a format message", () => {
    expect(firstError(emailSchema, "nope")).toBe("Invalid email address");
    expect(firstError(emailSchema, "a@b")).toBe("Invalid email address");
  });
});

describe("passwordSchema", () => {
  it("accepts a password meeting the policy", () => {
    expect(passwordSchema.safeParse("abcdefg1").success).toBe(true);
  });

  it("enforces the minimum length", () => {
    expect(firstError(passwordSchema, "abc123")).toBe(
      "Password must be at least 8 characters long",
    );
  });

  it("enforces the bcrypt 72-byte ceiling Supabase applies", () => {
    expect(firstError(passwordSchema, `${"a".repeat(72)}1`)).toBe(
      "Password must be at most 72 characters long",
    );
    expect(passwordSchema.safeParse(`${"a".repeat(71)}1`).success).toBe(true);
  });

  it("requires both a letter and a digit", () => {
    expect(firstError(passwordSchema, "12345678")).toBe(
      "Password must contain at least one letter",
    );
    expect(firstError(passwordSchema, "abcdefgh")).toBe(
      "Password must contain at least one number",
    );
  });
});

describe("loginSchema", () => {
  it("does not apply the sign-up password policy", () => {
    // Legacy accounts may hold shorter passwords; rejecting them client-side
    // would lock those users out of their own account.
    expect(
      loginSchema.safeParse({ email: "a@b.com", password: "old" }).success,
    ).toBe(true);
  });

  it("still requires a password to be present", () => {
    const result = loginSchema.safeParse({ email: "a@b.com", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const valid = {
    name: "Vlad",
    email: "vlad@example.com",
    password: "abcdefg1",
    confirmPassword: "abcdefg1",
  };

  it("accepts a valid registration", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("reports every invalid field at once", () => {
    // Regression guard: a submit used to surface only one message because the
    // form revalidated a single field on blur.
    const result = registerSchema.safeParse({
      name: "Te",
      email: "",
      password: "abcdefgh",
      confirmPassword: "different1",
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    const fields = result.error.issues.map((issue) => issue.path[0]);
    expect(fields).toEqual(
      expect.arrayContaining(["name", "email", "password", "confirmPassword"]),
    );
  });

  it("flags a password mismatch on the confirmation field", () => {
    const result = registerSchema.safeParse({
      ...valid,
      confirmPassword: "abcdefg2",
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    const mismatch = result.error.issues.find(
      (issue) => issue.message === "Passwords didn't match",
    );
    expect(mismatch?.path).toEqual(["confirmPassword"]);
  });

  it("trims the display name", () => {
    const parsed = registerSchema.parse({ ...valid, name: "  Vlad  " });
    expect(parsed.name).toBe("Vlad");
  });
});

describe("resetPasswordSchema", () => {
  it("applies the same password policy as sign-up", () => {
    expect(
      resetPasswordSchema.safeParse({
        password: "short1",
        confirmPassword: "short1",
      }).success,
    ).toBe(false);
  });
});
