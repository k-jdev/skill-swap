"use server";

import { createClient } from "@/shared/utils/supabase/server";

export async function getSkillProfile(skillId: string | number) {
  const supabase = await createClient();

  const { data: skill, error: skillError } = await supabase
    .from("skills")
    .select("user_id")
    .eq("id", skillId)
    .single();

  if (skillError || !skill) {
    console.error("Failed to fetch skill:", skillError?.message);
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", skill.user_id)
    .maybeSingle();

  if (profileError) {
    console.error("Failed to fetch profile:", profileError.message);
    return null;
  }

  return { profiles: profile };
}
