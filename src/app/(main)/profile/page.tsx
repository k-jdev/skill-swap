import { createMetadata } from "@/shared/lib/createMetadata";
import UserInfo from "@/features/profile/components/UserInfo";
import Skills from "@/features/profile/components/Skills";
import Reviews from "@/features/profile/components/Reviews";
import ProfileInitializer from "@/features/profile/components/ProfileInitializer";
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
        ? supabase.from("user_skills").select("name").eq("user_id", user.id)
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
        skills={(skills ?? []).map((s: { name: string }) => s.name)}
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
