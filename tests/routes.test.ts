import { describe, it, expect } from "vitest";
import {
  resolveAccess,
  safeRedirect,
  ROUTE_POLICIES,
} from "@/shared/config/routes";

describe("resolveAccess", () => {
  it("guards the profile subtree", () => {
    expect(resolveAccess("/profile")).toBe("auth");
    expect(resolveAccess("/profile/some-user-id")).toBe("auth");
  });

  it("guards skill creation but keeps skill detail public", () => {
    // The previous middleware blocked the whole /skill segment, which made
    // public listings unreachable for signed-out visitors.
    expect(resolveAccess("/skill/create")).toBe("auth");
    expect(resolveAccess("/skill/42")).toBe("public");
    expect(resolveAccess("/browser")).toBe("public");
  });

  it("keeps auth screens for guests only", () => {
    expect(resolveAccess("/login")).toBe("guest");
    expect(resolveAccess("/register")).toBe("guest");
    expect(resolveAccess("/forgot-password")).toBe("guest");
  });

  it("keeps the recovery screen reachable in both states", () => {
    // Reached from an email link while a recovery session is active.
    expect(resolveAccess("/auth/reset")).toBe("public");
  });

  it("defaults unknown routes to public", () => {
    expect(resolveAccess("/")).toBe("public");
    expect(resolveAccess("/how-it-works")).toBe("public");
    expect(resolveAccess("/anything-else")).toBe("public");
  });

  it("orders specific patterns before the subtree they live in", () => {
    const createIndex = ROUTE_POLICIES.findIndex(
      (policy) => policy.pattern === "/skill/create",
    );
    const subtreeIndex = ROUTE_POLICIES.findIndex(
      (policy) => policy.pattern === "/skill*",
    );
    expect(createIndex).toBeLessThan(subtreeIndex);
  });
});

describe("safeRedirect", () => {
  it("accepts same-origin absolute paths", () => {
    expect(safeRedirect("/profile")).toBe("/profile");
    expect(safeRedirect("/skill/create?draft=1")).toBe("/skill/create?draft=1");
  });

  it("rejects protocol-relative URLs", () => {
    // `//evil.com` is a valid URL to the browser — the classic open redirect.
    expect(safeRedirect("//evil.com")).toBeNull();
    expect(safeRedirect("//evil.com/path")).toBeNull();
  });

  it("rejects absolute URLs to other origins", () => {
    expect(safeRedirect("https://evil.com")).toBeNull();
    expect(safeRedirect("http://evil.com/steal")).toBeNull();
    expect(safeRedirect("javascript:alert(1)")).toBeNull();
  });

  it("rejects relative paths and empty input", () => {
    expect(safeRedirect("profile")).toBeNull();
    expect(safeRedirect("")).toBeNull();
    expect(safeRedirect(null)).toBeNull();
  });
});
