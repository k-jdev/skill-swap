import * as z from "zod";

const PROFICIENCY_LEVELS = ["beginner", "intermediate", "advanced"] as const;

export const skillSchema = z.object({
  skillTitle: z.string().min(1, "Skill title is required"),
  category: z.string().min(1, "Category is required"),
  language: z.string().min(1, "Teaching language is required"),
  proficiencyLevel: z.enum(PROFICIENCY_LEVELS),
  skillDescription: z.string().min(1, "Skill description is required"),
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB",
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPEG, PNG, and WEBP formats are allowed",
    ),
});

export type SkillFormData = z.infer<typeof skillSchema>;
