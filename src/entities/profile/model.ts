import { Review } from "../review/model";

/** Client-side view state for the profile currently on screen. */
export interface ProfileState {
  /** Id of the profile being displayed — not necessarily the viewer. */
  profileId: string;
  username: string;
  avatar_url: string;
  skills: string[];
  reviews: Review[];
  credits: number;
  isOwner: boolean;
  isEditing: boolean;
}

export interface ProfileParams {
  username: string;
  email: string;
  description: string;
  location?: string;
  avatar_url?: string;
  credits?: number;
}
