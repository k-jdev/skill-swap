// ui
export { default as ProfileInitializer } from "./components/ProfileInitializer";
export { default as UserInfo } from "./components/UserInfo";
export { default as Skills } from "./components/Skills";
export { default as Reviews } from "./components/Reviews";
export { default as Balance } from "./components/Balance";

// model
export { default as useProfileStore } from "./model/useProfileStore";

// api
export {
  getProfile,
  updateProfile,
  uploadAvatarImage,
} from "./api/profile.service";

// types
export type { ProfileState, ProfileParams } from "@/entities/profile/model";
