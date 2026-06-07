export interface Review {
  id: string;
  created_at: string;
  profile_id: string;
  author_id: string;
  author_name?: string;
  author?:
    | {
        username?: string | null;
        avatar_url?: string | null;
      }
    | {
        username?: string | null;
        avatar_url?: string | null;
      }[]
    | null;
  rating: number;
  content: string;
}

export type ReviewItem = {
  id: string;
  content: string;
  rating: number;
  created_at: string;
  author?: {
    username?: string | null;
    avatar_url?: string | null;
  } | null;
};
