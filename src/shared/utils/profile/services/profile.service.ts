import { createClient } from "@/shared/utils/supabase/client";

export interface ProfileParams {
  username: string;
  email: string;
  skill: string;
  description: string;
  location?: string;
}

export async function getProfile(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error while getting profile: ", error?.message);
    return null;
  }
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

export async function uploadAvatarImage(file: File, userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from("avatar-images")
    .upload(`public/${userId}`, file);

  if (error) {
    throw new Error(`Error uploading avatar: ${error.message}`);
  }

  return data;
}
