"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";
import { createClient } from "@/shared/utils/supabase/server";
import type { ActionResult } from "@/shared/types/action";
import { emailSchema } from "@/features/auth/schemas";

const AVATAR_BUCKET = "avatar-images";
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const profileUpdateSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must be at most 50 characters long"),
  email: emailSchema,
  description: z.string().trim().max(1000).default(""),
  location: z.string().trim().max(120).default(""),
  avatar_url: z.string().trim().default(""),
});

export type ProfileUpdateInput = z.input<typeof profileUpdateSchema>;

/**
 * The owner is resolved from the session cookie, never from the client.
 * A caller cannot pass someone else's id and overwrite their profile.
 */
export async function updateProfileAction(
  input: ProfileUpdateInput,
): Promise<ActionResult> {
  const parsed = profileUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form and try again.",
      code: "validation_failed",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in.", code: "unauthorized" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      username: parsed.data.username,
      email: parsed.data.email,
      description: parsed.data.description,
      location: parsed.data.location,
      avatar_url: parsed.data.avatar_url,
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: "Could not save your profile.", code: error.code };
  }

  revalidatePath("/profile");
  revalidatePath("/", "layout");
  return { success: true, data: undefined };
}

export async function uploadAvatarAction(
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
  if (file.size > MAX_AVATAR_BYTES) {
    return { success: false, error: "Image must be 2 MB or smaller.", code: "too_large" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in.", code: "unauthorized" };
  }

  // Path is namespaced by user id so the storage RLS policy
  // (`auth.uid() = (storage.foldername(name))[1]`) can enforce ownership.
  const extension = file.type.split("/")[1].replace("jpeg", "jpg");
  const path = `${user.id}/avatar.${extension}`;

  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) {
    return { success: false, error: "Could not upload the image.", code: "upload_failed" };
  }

  const { data: urlData } = supabase.storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(data.path);

  // Cache-bust: the path is stable across uploads, so the browser would
  // otherwise keep showing the previous avatar.
  const url = `${urlData.publicUrl}?v=${Date.now()}`;

  return { success: true, data: { url } };
}
