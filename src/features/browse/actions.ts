"use server";

import { createClient } from "@/shared/utils/supabase/server";

export async function getSkillAction() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return data;
}
