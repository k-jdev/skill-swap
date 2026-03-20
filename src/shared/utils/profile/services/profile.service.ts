import { createClient } from "@/shared/utils/supabase/client";

interface ProfileParams {
  name: string;
  email: string;
  skill: string;
  description: string;
  avatar?: string;
}

export async function getProfile(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

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
    .update(profileData)
    .eq("id", userId);
  if (error) {
    console.error("Error while getting profile: ", error?.message);
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
