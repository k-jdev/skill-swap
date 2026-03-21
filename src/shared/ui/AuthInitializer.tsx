"use client";
import { useEffect } from "react";
import { createClient } from "@/shared/utils/supabase/client";
import useProfileStore from "@/shared/store/useProfileStore";
import { getProfile } from "@/shared/utils/profile/services/profile.service";

export function AuthInitializer() {
  const {
    setIsAuthenticated,
    setName,
    setEmail,
    setTitle,
    setLocation,
    setBio,
  } = useProfileStore();

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setEmail(session.user.email ?? "");

        const profile = await getProfile(session.user.id);
        setName(
          profile?.username ?? session.user.user_metadata?.username ?? "",
        );
        setTitle(profile?.skill ?? "");
        setLocation(profile?.location ?? "");
        setBio(profile?.description ?? "");
      } else {
        setIsAuthenticated(false);
        setName("");
        setEmail("");
        setTitle("");
        setLocation("");
        setBio("");
      }
    });

    return () => subscription.unsubscribe();
  }, [setIsAuthenticated, setName, setEmail, setTitle, setLocation, setBio]);

  return null;
}
