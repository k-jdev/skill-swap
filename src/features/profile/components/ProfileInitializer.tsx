"use client";
import { useEffect } from "react";
import useProfileStore from "@/shared/store/useProfileStore";
import type { ProfileParams } from "@/shared/utils/profile/services/profile.service";
import type { Review } from "@/shared/store/useProfileStore";

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
      name: profile?.username ?? "",
      email: profile?.email ?? "",
      title: profile?.skill ?? "",
      location: profile?.location ?? "",
      bio: profile?.description ?? "",
      skills,
      reviews,
    });
  }, []);

  return null;
}
