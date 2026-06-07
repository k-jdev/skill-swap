import { createClient } from "@/shared/utils/supabase/client";
import { ProfileParams } from "@/entities/profile/model";

export async function getProfile(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*, reviews(*, author:author_id (username, avatar_url))")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error while getting profile: ", error?.message);
    return null;
  }
  console.log("Profile data:", data);
  return data as ProfileParams | null;
}

export async function updateProfile(
  userId: string,
  profileData: ProfileParams,
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...profileData })
    .eq("id", userId);
  if (error) {
    console.error("Error while updating profile: ", error?.message);
    return null;
  }
  return data;
}

export async function uploadAvatarImage(
  file: File,
  userId: string,
): Promise<string> {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from("avatar-images")
    .upload(`public/${userId}`, file, { upsert: true });

  if (error) {
    throw new Error(`Error uploading avatar: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from("avatar-images")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}
