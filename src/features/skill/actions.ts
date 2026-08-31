"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/shared/utils/supabase/server";
import { ActionResult } from "@/shared/types/action";
import * as z from "zod";

const SKILL_BUCKET = "skill-images";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const UNAUTHORIZED = {
  success: false,
  error: "You must be signed in.",
  code: "unauthorized",
} as const;

const INVALID_DATA = {
  success: false,
  error: "Please check the form and try again.",
  code: "validation_failed",
} as const;

const createSkillPayloadSchema = z.object({
  skillTitle: z.string().trim().min(1).max(120),
  skillPrice: z.number().nonnegative(),
  category: z.string().trim().min(1),
  language: z.string().trim().min(1),
  proficiencyLevel: z.enum(["beginner", "intermediate", "advanced"]),
  skillDescription: z.string().trim().min(1).max(5000),
  imagePath: z.string().trim().min(1),
});

type CreateSkillPayload = z.infer<typeof createSkillPayloadSchema>;

export async function createSkillAction(
  payload: CreateSkillPayload,
): Promise<ActionResult> {
  const parsed = createSkillPayloadSchema.safeParse(payload);
  if (!parsed.success) return INVALID_DATA;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return UNAUTHORIZED;

  const { error } = await supabase.from("skills").insert({
    user_id: user.id,
    skill_title: parsed.data.skillTitle,
    skill_price: parsed.data.skillPrice,
    category: [parsed.data.category],
    language: [parsed.data.language],
    proficiency_level: parsed.data.proficiencyLevel,
    description: parsed.data.skillDescription,
    image_url: parsed.data.imagePath,
  });

  if (error) return { success: false, error: error.message, code: error.code };

  revalidatePath("/browser");
  revalidatePath("/profile");
  return { success: true, data: undefined };
}

export async function addSkillAction(
  skillTitle: string,
): Promise<ActionResult> {
  const parsed = z.string().trim().min(1).max(120).safeParse(skillTitle);
  if (!parsed.success) return INVALID_DATA;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return UNAUTHORIZED;

  const { error } = await supabase
    .from("skills")
    .insert({ user_id: user.id, skill_title: parsed.data });

  if (error) {
    return { success: false, error: "Could not add the skill.", code: error.code };
  }

  revalidatePath("/profile");
  return { success: true, data: undefined };
}

export async function removeSkillAction(
  skillTitle: string,
): Promise<ActionResult> {
  const parsed = z.string().trim().min(1).safeParse(skillTitle);
  if (!parsed.success) return INVALID_DATA;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return UNAUTHORIZED;

  // Scoped to the caller: a client cannot delete another user's skill.
  const { error } = await supabase
    .from("skills")
    .delete()
    .eq("user_id", user.id)
    .eq("skill_title", parsed.data);

  if (error) {
    return { success: false, error: "Could not remove the skill.", code: error.code };
  }

  revalidatePath("/profile");
  return { success: true, data: undefined };
}

export async function uploadSkillImageAction(
  formData: FormData,
): Promise<ActionResult<{ url: string }>> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "No image selected.", code: "no_file" };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      success: false,
      error: "Only JPEG, PNG and WebP images are supported.",
      code: "bad_mime",
    };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { success: false, error: "Image must be 5 MB or smaller.", code: "too_large" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return UNAUTHORIZED;

  const extension = file.type.split("/")[1].replace("jpeg", "jpg");
  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;

  const { data, error } = await supabase.storage
    .from(SKILL_BUCKET)
    .upload(path, file, { contentType: file.type });

  if (error) {
    return { success: false, error: "Could not upload the image.", code: "upload_failed" };
  }

  const { data: urlData } = supabase.storage
    .from(SKILL_BUCKET)
    .getPublicUrl(data.path);

  return { success: true, data: { url: urlData.publicUrl } };
}
