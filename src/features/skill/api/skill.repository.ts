import { createClient } from "@/shared/utils/supabase/client";

/** Read-only data access from the browser. Writes go through server actions. */
export async function getSkill(skillId: string | number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("id", skillId)
    .maybeSingle();

  if (error) {
    console.error("getSkill:", error.message);
    return null;
  }

  return data;
}
