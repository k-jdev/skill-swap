"use server";

import { createClient } from "@/shared/utils/supabase/server";
import * as z from "zod";

const createSkillPayloadSchema = z.object({
  skillTitle: z.string().min(1),
  category: z.string().min(1),
  language: z.string().min(1),
  proficiencyLevel: z.enum(["beginner", "intermediate", "advanced"]),
  skillDescription: z.string().min(1),
  imagePath: z.string().min(1),
});

type CreateSkillPayload = z.infer<typeof createSkillPayloadSchema>;

export async function createSkillAction(payload: CreateSkillPayload) {
  const parsed = createSkillPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: "Invalid data" };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("skills").insert({
    user_id: user.id,
    skill_title: parsed.data.skillTitle,
    category: parsed.data.category,
    language: parsed.data.language,
    proficiency_level: parsed.data.proficiencyLevel,
    description: parsed.data.skillDescription,
    image_url: parsed.data.imagePath,
  });

  if (error) return { error: error.message };
  return { error: null };
}
