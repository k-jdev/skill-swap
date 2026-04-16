"use server";

import { createClient } from "@/shared/utils/supabase/server";
import { ActionResult } from "@/shared/types/action";
import { Skill } from "@/entities/skill/model";

export async function getSkillAction(
  category?: string,
  searchTerm?: string,
): Promise<ActionResult<Skill[]>> {
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

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}
