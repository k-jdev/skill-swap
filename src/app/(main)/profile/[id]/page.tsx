import { notFound } from "next/navigation";
import { createClient } from "@/shared/utils/supabase/server";
import {
  UserInfo,
  Skills,
  Reviews,
  ProfileInitializer,
} from "@/features/profile";
import { createMetadata } from "@/shared/lib/createMetadata";

export const metadata = createMetadata("Profile", "User profile page");

export default async function ProfileByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !profile) {
    notFound();
  }

  const { data: skills } = await supabase
    .from("skills")
    .select("skill_title")
    .eq("user_id", id);

  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      "id, created_at, profile_id, author_id, rating, content, author:author_id (username, avatar_url)",
    )
    .eq("profile_id", id)
    .order("created_at", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwnProfile = user?.id === id;

  return (
    <div className="mx-[240px] mt-10 min-h-screen rounded-4xl bg-white shadow-md">
      <ProfileInitializer
        userId={id}
        profile={profile}
        skills={(skills ?? []).map(
          (s: { skill_title: string }) => s.skill_title,
        )}
        reviews={reviews ?? []}
      />
      <UserInfo
        userId={id}
        initialData={profile}
        authEmail={user?.email ?? ""}
        authName={user?.user_metadata?.username ?? ""}
        readOnly={!isOwnProfile}
      />
      <Skills />
      <Reviews />
    </div>
  );
}
