import { createClient } from "@/shared/utils/supabase/server";
import type { SessionState, SessionUser } from "./model";

/**
 * Single server-side source of truth for "who is looking at this page".
 *
 * Identity is read from the `profiles` table rather than `user_metadata`, so
 * an avatar or username edit is reflected everywhere on the next render.
 */
export async function getSession(): Promise<SessionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, status: "anonymous" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email ?? "",
    username:
      profile?.username ||
      (user.user_metadata?.username as string | undefined) ||
      (user.email ? user.email.split("@")[0] : ""),
    avatar_url: profile?.avatar_url ?? "",
  };

  return { user: sessionUser, status: "authenticated" };
}

/** Throws-free helper for actions that need the caller's id. */
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}
