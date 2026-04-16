import { Review } from "../review/model";
export interface ProfileState {
  isAuthenticated: boolean;
  isEditing: boolean;
  email?: string;
  name?: string;
  userId: string;
  username: string;
  avatar_url: string;
  skills: string[];
  reviews: Review[];
}

export interface ProfileParams {
  username: string;
  email: string;

  description: string;
  location?: string;
  avatar_url?: string;
}
