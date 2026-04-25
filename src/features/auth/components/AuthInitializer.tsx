"use client";
import { useEffect } from "react";
import { createClient } from "@/shared/utils/supabase/client";
import useProfileStore from "@/features/profile/model/useProfileStore";

export function AuthInitializer() {
  const { setProfile, reset } = useProfileStore();

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setProfile({
          isAuthenticated: true,
          userId: session.user.id,
          username: session.user.user_metadata?.username ?? "",
          avatar_url: session.user.user_metadata?.avatar_url ?? "",
        });
      } else {
        reset();
      }
    });

    return () => subscription.unsubscribe();
  }, [setProfile, reset]);

  return null;
}
