// ui
export { default as ProfileBoard } from "./components/ProfileBoard";
export { default as UserInfo } from "./components/UserInfo";
export { default as Skills } from "./components/Skills";
export { default as Reviews } from "./components/Reviews";
export { default as Balance } from "./components/Balance";

// model
export { default as useProfileStore } from "./model/useProfileStore";

// actions
export {
  updateProfileAction,
  uploadAvatarAction,
} from "./actions";

// types
export type { ProfileState, ProfileParams } from "@/entities/profile/model";
