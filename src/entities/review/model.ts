export interface Review {
  id: string;
  created_at: string;
  profile_id: string;
  author_id: string;
  author_name: string;
  rating: number;
  content: string;
}
