"use server";

import { createClient } from "@/shared/utils/supabase/server";

export async function getSkillAction(category?: string, searchTerm?: string) {
  const supabase = await createClient();

  let query = supabase.from("skills").select("*");

  if (category && category != "All") {
    query = query.eq("category", category);
  }
  if (searchTerm) {
    query = query.ilike("skill_title", `%${searchTerm}%`);
  }
  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) return { error: error.message };
  return data;
}
