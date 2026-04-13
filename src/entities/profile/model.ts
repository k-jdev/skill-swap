export interface Review {
  id: string;
  profile_id: string;
  author_id: string;
  //delete under string
  author_name: string;
  rating: number;
  content: string;
  created_at: string;
}

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
  skill: string;
  description: string;
  location?: string;
  avatar_url?: string;
}
