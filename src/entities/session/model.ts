/** Identity of the signed-in visitor. Never holds editable profile data. */
export interface SessionUser {
  id: string;
  email: string;
  username: string;
  avatar_url: string;
}

export type SessionStatus = "authenticated" | "anonymous";

export interface SessionState {
  user: SessionUser | null;
  status: SessionStatus;
}
