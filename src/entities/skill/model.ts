export interface Skill {
  id: number;
  created_at: Date;
  user_id: string;
  description: string | null;
  skill_title: string;
  category: string[] | null;
  language: string[] | null;
  image_url: string;
}
