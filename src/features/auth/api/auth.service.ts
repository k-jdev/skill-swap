import { createClient } from "@/shared/utils/supabase/client";

/**
 * Browser-side sign-out. Prefer `logoutAction` — it also clears the server
 * session cookie and revalidates the tree. This helper only exists for the
 * rare client-only path (e.g. reacting to a revoked token).
 */
export async function logoutUser() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}
