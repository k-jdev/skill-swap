// ui(detail)
export { default as SkillDetail } from "./components/detail/index";

// ui(create)
export { default as SkillForm } from "./components/create/SkillForm";
export { default as SkillCreateHeader } from "./components/create/Header";

// model
export { default as useSkillsStore } from "./model/useSkillsStore";

// api
export { getSkill } from "./api/skill.repository";
export { getSkillById, getSkillProfile } from "./api/skill.server";

// actions
export {
  createSkillAction,
  addSkillAction,
  removeSkillAction,
  uploadSkillImageAction,
} from "./actions";

// schemas
export { skillSchema } from "./schemas/skill.schema";
export type { SkillFormData } from "./schemas/skill.schema";

// types
export type { Skill } from "@/entities/skill/model";
