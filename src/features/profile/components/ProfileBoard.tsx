"use client";

import React from "react";
import useProfileStore from "@/features/profile/model/useProfileStore";
import UserInfo from "./UserInfo";
import Balance from "./Balance";
import Skills from "./Skills";
import Reviews from "./Reviews";
import type { ProfileParams, Review } from "@/entities";

type Props = {
  profileId: string;
  profile: ProfileParams | null;
  skills: string[];
  reviews: Review[];
  isOwner: boolean;
  authEmail?: string;
  authName?: string;
};

/**
 * Owns the client-side profile state for one profile page.
 *
 * This replaces the previous `ProfileInitializer` null-renderer: the store is
 * seeded during the first render (and re-seeded when the server sends new
 * data), so children never flash empty state and a navigation between two
 * profiles cannot leave the previous user's skills on screen.
 */
export default function ProfileBoard({
  profileId,
  profile,
  skills,
  reviews,
  isOwner,
  authEmail = "",
  authName = "",
}: Props) {
  const setProfile = useProfileStore((state) => state.setProfile);
  const seeded = React.useRef<string | null>(null);

  const snapshot = React.useMemo(
    () => ({
      profileId,
      username: profile?.username ?? authName,
      avatar_url: profile?.avatar_url ?? "",
      credits: profile?.credits ?? 0,
      skills,
      reviews,
      isOwner,
      isEditing: false,
    }),
    [profileId, profile, authName, skills, reviews, isOwner],
  );

  if (seeded.current !== profileId) {
    useProfileStore.setState(snapshot);
    seeded.current = profileId;
  }

  React.useEffect(() => {
    setProfile(snapshot);
  }, [snapshot, setProfile]);

  return (
    <>
      <UserInfo
        profileId={profileId}
        initialData={profile}
        authEmail={authEmail}
        authName={authName}
        readOnly={!isOwner}
      />
      <Balance />
      <Skills />
      <Reviews />
    </>
  );
}
