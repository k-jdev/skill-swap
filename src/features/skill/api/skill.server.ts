"use server";

import { createClient } from "@/shared/utils/supabase/server";

/** Server-side skill read used by the detail page (RSC). */
export async function getSkillById(skillId: string | number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("id", skillId)
    .maybeSingle();

  if (error) {
    console.error("getSkillById:", error.message);
    return null;
  }

  return data;
}

export async function getSkillProfile(skillId: string | number) {
  const supabase = await createClient();

  const { data: skill, error: skillError } = await supabase
    .from("skills")
    .select("user_id")
    .eq("id", skillId)
    .maybeSingle();

  if (skillError || !skill) {
    console.error("getSkillProfile:", skillError?.message);
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", skill.user_id)
    .maybeSingle();

  if (profileError) {
    console.error("getSkillProfile:", profileError.message);
    return null;
  }

  return { profiles: profile };
}
