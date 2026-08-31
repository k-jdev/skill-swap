import { create } from "zustand";
import { ProfileState } from "@/entities/profile/model";

interface ProfileStore extends ProfileState {
  setProfile: (patch: Partial<ProfileState>) => void;
  reset: () => void;
}

const initialState: ProfileState = {
  profileId: "",
  username: "",
  avatar_url: "",
  skills: [],
  reviews: [],
  credits: 0,
  isOwner: false,
  isEditing: false,
};

const useProfileStore = create<ProfileStore>((set) => ({
  ...initialState,
  setProfile: (patch) => set((state) => ({ ...state, ...patch })),
  reset: () => set(initialState),
}));

export default useProfileStore;
