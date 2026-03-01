import { createClient } from "@/shared/utils/supabase/client";

interface LoginParams {
  email: string;
  password: string;
}

interface RegisterParams {
  email: string;
  password: string;
  name: string;
}

// export async function loginUser({ email, password }: LoginParams) {
//   const supabase = createClient();

//   const { data, error } = await supabase.auth.signInWithPassword({
//     email: email.trim(),
//     password,
//   });

//   return { data, error };
// }

// export async function registerUser({ email, password, name }: RegisterParams) {
//   const supabase = createClient();

//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       data: {
//         username: name,
//       },
//     },
//   });

//   return { data, error };
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
