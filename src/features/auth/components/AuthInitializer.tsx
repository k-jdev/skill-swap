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
        setProfile({ isAuthenticated: true });
      } else {
        reset();
      }
    });

    return () => subscription.unsubscribe();
  }, [setProfile, reset]);

  return null;
}
