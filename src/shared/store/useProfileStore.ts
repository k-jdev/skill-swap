import { create } from "zustand";

export interface Review {
  id: string;
  profile_id: string;
  author_id: string;
  //delete under string
  author_name: string;
  rating: number;
  content: string;
  created_at: string;
}

export interface ProfileState {
  isAuthenticated: boolean;
  isEditing: boolean;
  userId: string;
  username: string;
  avatar_url: string;
  skills: string[];
  reviews: Review[];
}

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
