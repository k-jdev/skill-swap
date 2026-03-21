"use client";
import { useEffect } from "react";
import { createClient } from "@/shared/utils/supabase/client";
import useProfileStore from "@/shared/store/useProfileStore";
import { getProfile } from "@/shared/utils/profile/services/profile.service";

export function AuthInitializer() {
  const { setProfile, reset } = useProfileStore();

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await getProfile(session.user.id);
        setProfile({
          isAuthenticated: true,
          email: session.user.email ?? "",
          name: profile?.username ?? session.user.user_metadata?.username ?? "",
          title: profile?.skill ?? "",
          location: profile?.location ?? "",
          bio: profile?.description ?? "",
        });
      } else {
        reset();
      }
    });

    return () => subscription.unsubscribe();
  }, [setProfile, reset]);

  return null;
}
