import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/shared/config/env";
import {
  resolveAccess,
  safeRedirect,
  signInPath,
  defaultAuthedPath,
  redirectParam,
} from "@/shared/config/routes";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Must run before any redirect decision: this is what rotates the
  // refresh token and populates `supabaseResponse` with fresh cookies.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const access = resolveAccess(pathname);

  if (access === "auth" && !user) {
    const url = request.nextUrl.clone();
    url.pathname = signInPath;
    url.search = "";
    url.searchParams.set(redirectParam, pathname + request.nextUrl.search);
    return redirectPreservingSession(url, supabaseResponse);
  }

  if (access === "guest" && user) {
    const url = request.nextUrl.clone();
    const target =
      safeRedirect(request.nextUrl.searchParams.get(redirectParam)) ??
      defaultAuthedPath;
    url.pathname = target;
    url.search = "";
    return redirectPreservingSession(url, supabaseResponse);
  }

  return supabaseResponse;
}

/**
 * A bare `NextResponse.redirect()` drops the refreshed auth cookies that
 * `getUser()` just wrote, which logs the user out on every guarded redirect.
 * Copying them onto the redirect response is what keeps the session alive.
 */
function redirectPreservingSession(url: URL, source: NextResponse) {
  const redirect = NextResponse.redirect(url);
  source.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
