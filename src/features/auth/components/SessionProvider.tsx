"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/utils/supabase/client";
import useSessionStore from "@/features/auth/model/useSessionStore";
import type { SessionState } from "@/entities/session/model";

/**
 * Hydrates the client session store from the value the server already
 * resolved, so the first paint is correct and the navigation never flashes
 * "Login / Sign Up" at a signed-in user.
 *
 * The realtime subscription is only used to react to changes made elsewhere
 * (another tab signing out, a token refresh). Sign-in and sign-out inside
 * this tab go through server actions plus `router.refresh()`.
 */
export function SessionProvider({
  initial,
  children,
}: {
  initial: SessionState;
  children: React.ReactNode;
}) {
  const setUser = useSessionStore((state) => state.setUser);
  const router = useRouter();

  // Hydrate during render so children never observe the empty initial state.
  const hydrated = useRef(false);
  if (!hydrated.current) {
    useSessionStore.setState({
      user: initial.user,
      status: initial.status,
    });
    hydrated.current = true;
  }

  useEffect(() => {
    setUser(initial.user);
  }, [initial.user, setUser]);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" || event === "SIGNED_IN") {
        // Let the server recompute the session; it owns the profile join.
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return <>{children}</>;
}

export default SessionProvider;
