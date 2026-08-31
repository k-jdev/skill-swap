import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSupabaseMock, findCall } from "./helpers/supabaseMock";

// Server-action modules pull in Next.js server APIs that have no meaning
// outside a request; stub them so the business logic can be exercised.
const createClientMock = vi.fn();

vi.mock("@/shared/utils/supabase/server", () => ({
  createClient: () => createClientMock(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: async () => new Map([["origin", "http://localhost:3000"]]),
}));

const { loginAction, registerAction } = await import("@/features/auth/actions");
const { updateProfileAction, uploadAvatarAction } = await import(
  "@/features/profile/actions"
);
const { addSkillAction, removeSkillAction } = await import(
  "@/features/skill/actions"
);

const SESSION_USER = { id: "session-user-id", email: "owner@example.com" };

beforeEach(() => {
  createClientMock.mockReset();
});

function useMock(options: Parameters<typeof createSupabaseMock>[0] = {}) {
  const mock = createSupabaseMock(options);
  createClientMock.mockResolvedValue(mock.client);
  return mock;
}

describe("loginAction", () => {
  it("rejects a malformed payload before calling Supabase", async () => {
    const mock = useMock();

    const result = await loginAction({ email: "nope", password: "" });

    expect(result).toEqual({
      success: false,
      error: "Please check the form and try again.",
      code: "validation_failed",
    });
    expect(mock.client.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("returns generic copy instead of the raw Supabase message", async () => {
    useMock({
      signIn: {
        error: {
          name: "AuthApiError",
          message: "Invalid login credentials",
          code: "invalid_credentials",
          status: 400,
        },
      },
    });

    const result = await loginAction({
      email: "user@example.com",
      password: "whatever1",
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toBe("Invalid email or password.");
    expect(result.code).toBe("invalid_credentials");
  });

  it("signs in with the normalised email", async () => {
    const mock = useMock();

    const result = await loginAction({
      email: "  USER@Example.COM ",
      password: "abcdefg1",
    });

    expect(result.success).toBe(true);
    expect(mock.client.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "abcdefg1",
    });
  });
});

describe("registerAction", () => {
  const payload = {
    name: "Vlad",
    email: "new@example.com",
    password: "abcdefg1",
    confirmPassword: "abcdefg1",
  };

  it("reports when the account still needs email confirmation", async () => {
    useMock({
      signUp: { data: { session: null, user: { id: "u1" } }, error: null },
    });

    const result = await registerAction(payload);

    expect(result).toEqual({
      success: true,
      data: { needsEmailConfirmation: true },
    });
  });

  it("reports an active session when confirmation is disabled", async () => {
    useMock({
      signUp: {
        data: { session: { access_token: "t" }, user: { id: "u1" } },
        error: null,
      },
    });

    const result = await registerAction(payload);

    expect(result).toEqual({
      success: true,
      data: { needsEmailConfirmation: false },
    });
  });

  it("does not insert a profile row from application code", async () => {
    // Ownership of profile creation belongs to the `handle_new_user` trigger,
    // so sign-up stays atomic and also covers OAuth users.
    const mock = useMock();

    await registerAction(payload);

    expect(findCall(mock.calls, "profiles", "insert")).toBeUndefined();
  });
});

describe("updateProfileAction", () => {
  const input = {
    username: "Vlad",
    email: "owner@example.com",
    description: "About me",
    location: "Moscow",
    avatar_url: "",
  };

  it("refuses anonymous callers", async () => {
    const mock = useMock({ user: null });

    const result = await updateProfileAction(input);

    expect(result).toEqual({
      success: false,
      error: "You must be signed in.",
      code: "unauthorized",
    });
    expect(findCall(mock.calls, "profiles", "update")).toBeUndefined();
  });

  it("scopes the update to the session user", async () => {
    const mock = useMock({ user: SESSION_USER });

    const result = await updateProfileAction(input);

    expect(result.success).toBe(true);
    const call = findCall(mock.calls, "profiles", "update");
    expect(call?.filters).toEqual([
      { column: "id", value: SESSION_USER.id },
    ]);
  });

  it("ignores an id smuggled into the payload", async () => {
    // The previous client-side upsert accepted a caller-supplied id, which
    // meant a crafted request could overwrite another member's profile.
    const mock = useMock({ user: SESSION_USER });

    await updateProfileAction({
      ...input,
      id: "victim-user-id",
    } as unknown as typeof input);

    const call = findCall(mock.calls, "profiles", "update");
    expect(call?.filters).toEqual([{ column: "id", value: SESSION_USER.id }]);
    expect(call?.payload).not.toHaveProperty("id");
  });

  it("validates the payload before touching the database", async () => {
    const mock = useMock({ user: SESSION_USER });

    const result = await updateProfileAction({ ...input, username: "no" });

    expect(result.success).toBe(false);
    expect(findCall(mock.calls, "profiles", "update")).toBeUndefined();
  });
});

describe("uploadAvatarAction", () => {
  function formDataWith(file: File | null) {
    const formData = new FormData();
    if (file) formData.append("file", file);
    return formData;
  }

  it("rejects file types outside the allow-list", async () => {
    useMock({ user: SESSION_USER });
    const file = new File(["x"], "payload.svg", { type: "image/svg+xml" });

    const result = await uploadAvatarAction(formDataWith(file));

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.code).toBe("bad_mime");
  });

  it("rejects files above the size limit", async () => {
    useMock({ user: SESSION_USER });
    const big = new File([new Uint8Array(3 * 1024 * 1024)], "big.png", {
      type: "image/png",
    });

    const result = await uploadAvatarAction(formDataWith(big));

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.code).toBe("too_large");
  });

  it("refuses anonymous callers", async () => {
    useMock({ user: null });
    const file = new File(["x"], "a.png", { type: "image/png" });

    const result = await uploadAvatarAction(formDataWith(file));

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.code).toBe("unauthorized");
  });

  it("writes under a path namespaced by the session user", async () => {
    // Storage RLS matches `auth.uid() = (storage.foldername(name))[1]`, so the
    // prefix is what enforces ownership.
    const mock = useMock({ user: SESSION_USER });
    const file = new File(["x"], "a.png", { type: "image/png" });

    const result = await uploadAvatarAction(formDataWith(file));

    expect(result.success).toBe(true);
    expect(mock.uploads[0].bucket).toBe("avatar-images");
    expect(mock.uploads[0].path).toBe(`${SESSION_USER.id}/avatar.png`);
  });
});

describe("skill actions", () => {
  it("inserts skills owned by the session user", async () => {
    const mock = useMock({ user: SESSION_USER });

    const result = await addSkillAction("design");

    expect(result.success).toBe(true);
    expect(findCall(mock.calls, "skills", "insert")?.payload).toEqual({
      user_id: SESSION_USER.id,
      skill_title: "design",
    });
  });

  it("scopes deletion to the session user, not just the title", async () => {
    const mock = useMock({ user: SESSION_USER });

    const result = await removeSkillAction("design");

    expect(result.success).toBe(true);
    expect(findCall(mock.calls, "skills", "delete")?.filters).toEqual([
      { column: "user_id", value: SESSION_USER.id },
      { column: "skill_title", value: "design" },
    ]);
  });

  it("refuses anonymous callers", async () => {
    const mock = useMock({ user: null });

    await expect(addSkillAction("design")).resolves.toMatchObject({
      code: "unauthorized",
    });
    await expect(removeSkillAction("design")).resolves.toMatchObject({
      code: "unauthorized",
    });
    expect(mock.calls).toHaveLength(0);
  });
});
