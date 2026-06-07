import { createClient } from "@/shared/utils/supabase/client";

export async function uploadSkillImage(file: File): Promise<string | null> {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("skil-images")
    .upload(fileName, file);

  if (error) {
    console.error("Failed to upload image:", error.message);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from("skil-images")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function getSkill(skillId: string | number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("id", skillId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch skill:", error.message);
    return null;
  }

  return data;
}

export async function addSkill(userId: string, skillTitle: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("skills")
    .insert({ user_id: userId, skill_title: skillTitle });
  return { error };
}

export async function removeSkill(userId: string, skillTitle: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("skills")
    .delete()
    .eq("user_id", userId)
    .eq("skill_title", skillTitle);

  return { error };
}
