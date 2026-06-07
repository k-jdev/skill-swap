export interface Skill {
  id: number;
  created_at: Date;
  user_id: string;
  description: string | null;
  skill_title: string;
  skill_price: number;
  category: string[] | null;
  language: string[] | null;
  image_url: string;
}
