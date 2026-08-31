/**
 * Declarative route access policy (Strategy pattern).
 *
 * The middleware walks this list top to bottom and applies the first match,
 * so specific rules must come before the broader segment they live in.
 *
 *   "public" — anyone
 *   "auth"   — signed-in users only; anonymous visitors go to `signInPath`
 *   "guest"  — anonymous visitors only; signed-in users go to `defaultAuthedPath`
 */
export type RouteAccess = "public" | "auth" | "guest";

export type RoutePolicy = {
  /** Matched against `pathname`; a trailing `*` matches the whole subtree. */
  pattern: string;
  access: RouteAccess;
};

export const ROUTE_POLICIES: RoutePolicy[] = [
  { pattern: "/login", access: "guest" },
  { pattern: "/register", access: "guest" },
  { pattern: "/forgot-password", access: "guest" },

  // The reset screen is reached from an email link while a recovery session
  // is active, so it must stay reachable in both states.
  { pattern: "/auth/reset", access: "public" },

  { pattern: "/profile*", access: "auth" },
  { pattern: "/skill/create", access: "auth" },

  // Everything else under /skill (detail pages, listing) is public.
  { pattern: "/skill*", access: "public" },
  { pattern: "/browser*", access: "public" },
];

export const signInPath = "/login";
export const defaultAuthedPath = "/";
export const redirectParam = "redirectTo";

export function resolveAccess(pathname: string): RouteAccess {
  for (const policy of ROUTE_POLICIES) {
    if (policy.pattern.endsWith("*")) {
      const base = policy.pattern.slice(0, -1);
      if (pathname === base || pathname.startsWith(base)) return policy.access;
    } else if (pathname === policy.pattern) {
      return policy.access;
    }
  }
  return "public";
}

/**
 * Only same-origin, absolute paths are accepted, so `?redirectTo=` cannot be
 * used as an open redirect to an attacker-controlled host.
 */
export function safeRedirect(target: string | null): string | null {
  if (!target) return null;
  if (!target.startsWith("/") || target.startsWith("//")) return null;
  return target;
}
