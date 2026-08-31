import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProfileParams } from "@/entities/profile/model";

/**
 * Pure data access. Takes a client (browser or server) and returns rows —
 * no auth decisions, no toasts, no revalidation. Actions compose these.
 */
export async function findProfileById(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfileParams | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("findProfileById:", error.message);
    return null;
  }
  return data as ProfileParams | null;
}

export async function findProfileSkills(
  supabase: SupabaseClient,
  userId: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from("skills")
    .select("skill_title")
    .eq("user_id", userId);

  if (error) {
    console.error("findProfileSkills:", error.message);
    return [];
  }
  return (data ?? []).map((row: { skill_title: string }) => row.skill_title);
}
