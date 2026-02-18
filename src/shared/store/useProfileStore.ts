import { create } from "zustand";
interface ProfileStore {
  isAuthenticated: boolean;
  name: string;
  email: string;
  avatar: string;
  setIsAuthenticated: (value: boolean) => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setAvatar: (avatar: string) => void;
}
const useProfileStore = create<ProfileStore>((set) => ({
  name: "",
  email: "",
  avatar: "",
  isAuthenticated: false,
  setName: (name: string) => set({ name }),
  setEmail: (email: string) => set({ email }),
  setAvatar: (avatar: string) => set({ avatar }),
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
}));

export default useProfileStore;
