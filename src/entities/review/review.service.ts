import { createClient } from "@/shared/utils/supabase/client";
import { Review } from "./model";

export async function addReview(
  authorId: string,
  profileId: string,
  skillId: number,
  content: string,
  rating: number,
) {
  const supabase = createClient();

  const { error } = await supabase.from("reviews").insert({
    author_id: authorId,
    profile_id: profileId,
    content: content,
    rating: rating,
    skill_id: skillId,
  });

  return { error };
}

export async function updateReview(
  id: string,
  content: string,
  rating: number,
): Promise<Review> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("reviews")
    .update({ content: content, rating: rating })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Failed to update review");
  }

  return data;
}

export async function getReview(skillId: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id, content, rating, created_at, author:author_id (username, avatar_url)",
    )
    .eq("skill_id", skillId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch review:", error.message);
    return null;
  }

  return data;
}
