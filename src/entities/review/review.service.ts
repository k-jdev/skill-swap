import { createClient } from "@/shared/utils/supabase/client";
import { Review } from "./model";

export async function addReview(
  userId: string,
  profileId: number,
  skillId: number,
  content: string,
  rating: number,
) {
  const supabase = createClient();

  const { error } = await supabase.from("reviews").insert({
    author_id: userId,
    profile_id: profileId,
    content: content,
    rating: rating,
    skill_id: skillId,
  });

  return { error };
}

export async function getReview(skillId: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", skillId);

  if (error) {
    console.error("Failed to fetch review:", error.message);
    return null;
  }

  return data;
}
