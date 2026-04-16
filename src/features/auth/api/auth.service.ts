import { createClient } from "@/shared/utils/supabase/client";

// interface LoginParams {
//   email: string;
//   password: string;
// }

// interface RegisterParams {
//   email: string;
//   password: string;
//   name: string;
// }

export async function logoutUser() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
}
