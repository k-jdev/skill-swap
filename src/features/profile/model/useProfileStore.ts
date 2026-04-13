import { create } from "zustand";
import { ProfileState } from "@/entities/profile/model";

interface ProfileStore extends ProfileState {
  setProfile: (patch: Partial<ProfileState>) => void;
  reset: () => void;
}

const initialState: ProfileState = {
  isAuthenticated: false,
  isEditing: false,
  userId: "",
  username: "",
  avatar_url: "",
  skills: [],
  reviews: [],
};

const useProfileStore = create<ProfileStore>((set) => ({
  ...initialState,
  setProfile: (patch) => set((state) => ({ ...state, ...patch })),
  reset: () => set(initialState),
}));

export default useProfileStore;
