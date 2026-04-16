"use client";
import { useEffect } from "react";
import useProfileStore from "@/features/profile/model/useProfileStore";

import { Review, ProfileParams } from "@/entities";

type Props = {
  userId: string;
  profile: ProfileParams | null;
  skills: string[];
  reviews: Review[];
};

export default function ProfileInitializer({
  userId,
  profile,
  skills,
  reviews,
}: Props) {
  const { setProfile } = useProfileStore();

  useEffect(() => {
    setProfile({
      userId,
      username: profile?.username ?? "",
      avatar_url: profile?.avatar_url ?? "",
      skills,
      reviews,
    });
  });

  return null;
}
