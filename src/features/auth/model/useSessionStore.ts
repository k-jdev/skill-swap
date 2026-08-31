import { create } from "zustand";
import type { SessionState, SessionUser } from "@/entities/session/model";

interface SessionStore extends SessionState {
  setUser: (user: SessionUser | null) => void;
  clear: () => void;
}

const useSessionStore = create<SessionStore>((set) => ({
  user: null,
  status: "anonymous",
  setUser: (user) =>
    set({ user, status: user ? "authenticated" : "anonymous" }),
  clear: () => set({ user: null, status: "anonymous" }),
}));

export default useSessionStore;

/** Convenience selectors — keep components subscribed to one slice each. */
export const useSessionUser = () => useSessionStore((state) => state.user);
export const useIsAuthenticated = () =>
  useSessionStore((state) => state.status === "authenticated");
