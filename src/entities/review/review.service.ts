import { createClient } from "@/shared/utils/supabase/client";
import { Review } from "./model";

export async function addReview(
  authorId: string,
  content: string,
  rating: number,
  skillId: string,
  profileId: string,
): Promise<Review> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      author_id: authorId,
      content: content,
      rating: rating,
      skill_id: skillId,
      profile_id: profileId,
    })
    .select()
    .single();

  if (error) {
    throw new Error("Failed to insert skill");
  }

  return data;
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
