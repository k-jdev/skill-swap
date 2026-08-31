import { notFound, redirect } from "next/navigation";
import { createClient } from "@/shared/utils/supabase/server";
import { ProfileBoard } from "@/features/profile";
import { createMetadata } from "@/shared/lib/createMetadata";
import type { ProfileParams, Review } from "@/entities";

export const metadata = createMetadata("Profile", "User profile page");

export default async function ProfileByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Own profile lives at /profile — keep a single canonical URL.
  if (user?.id === id) redirect("/profile");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !profile) notFound();

  const [{ data: skills }, { data: reviews }] = await Promise.all([
    supabase.from("skills").select("skill_title").eq("user_id", id),
    supabase
      .from("reviews")
      .select(
        "id, created_at, profile_id, author_id, rating, content, author:author_id (username, avatar_url)",
      )
      .eq("profile_id", id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="mx-auto mt-10 w-full max-w-6xl rounded-4xl bg-white px-4 shadow-md sm:px-0">
      <ProfileBoard
        profileId={id}
        profile={profile as ProfileParams}
        skills={(skills ?? []).map((s: { skill_title: string }) => s.skill_title)}
        reviews={(reviews ?? []) as unknown as Review[]}
        isOwner={false}
      />
    </div>
  );
}
