import { redirect } from "next/navigation";
import { createMetadata } from "@/shared/lib/createMetadata";
import { ProfileBoard } from "@/features/profile";
import { createClient } from "@/shared/utils/supabase/server";
import type { ProfileParams, Review } from "@/entities";

export const metadata = createMetadata("Profile", "Your profile page");

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The middleware already guards this route; this is the defence in depth
  // that keeps the page from rendering an empty shell if it is ever reached.
  if (!user) redirect("/login?redirectTo=/profile");

  const [{ data: profile }, { data: skills }, { data: reviews }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase.from("skills").select("skill_title").eq("user_id", user.id),
      supabase
        .from("reviews")
        .select(
          "id, created_at, profile_id, author_id, rating, content, author:author_id (username, avatar_url)",
        )
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

  return (
    <div className="mx-auto mt-10 w-full max-w-6xl rounded-4xl bg-white px-4 shadow-md sm:px-0">
      <ProfileBoard
        profileId={user.id}
        profile={profile as ProfileParams | null}
        skills={(skills ?? []).map((s: { skill_title: string }) => s.skill_title)}
        reviews={(reviews ?? []) as unknown as Review[]}
        isOwner
        authEmail={user.email ?? ""}
        authName={(user.user_metadata?.username as string) ?? ""}
      />
    </div>
  );
}
