import { createMetadata } from "@/shared/lib/createMetadata";
import {
  UserInfo,
  Skills,
  Reviews,
  ProfileInitializer,
} from "@/features/profile";
import { createClient } from "@/shared/utils/supabase/server";

export const metadata = createMetadata("Profile", "Your profile page");

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: skills }, { data: reviews }] =
    await Promise.all([
      user
        ? supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
        : Promise.resolve({ data: null }),
      user
        ? supabase.from("skills").select("skill_title").eq("user_id", user.id)
        : Promise.resolve({ data: [] }),
      user
        ? supabase
            .from("reviews")
            .select("*")
            .eq("profile_id", user.id)
            .order("created_at", { ascending: false })
        : Promise.resolve({ data: [] }),
    ]);

  return (
    <div className="mx-[240px] mt-10 min-h-screen rounded-4xl bg-white shadow-md">
      <ProfileInitializer
        userId={user?.id ?? ""}
        profile={profile}
        skills={(skills ?? []).map(
          (s: { skill_title: string }) => s.skill_title,
        )}
        reviews={reviews ?? []}
      />
      <UserInfo
        userId={user?.id ?? ""}
        initialData={profile}
        authEmail={user?.email ?? ""}
        authName={user?.user_metadata?.username ?? ""}
      />
      <Skills />
      <Reviews />
    </div>
  );
}
