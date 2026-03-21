import { create } from "zustand";
interface ProfileStore {
  isAuthenticated: boolean;
  name: string;
  email: string;
  avatar: string;
  title: string;
  location: string;
  bio: string;
  setIsAuthenticated: (value: boolean) => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setAvatar: (avatar: string) => void;
  setTitle: (title: string) => void;
  setLocation: (location: string) => void;
  setBio: (bio: string) => void;
}
const useProfileStore = create<ProfileStore>((set) => ({
  name: "",
  email: "",
  avatar: "",
  title: "",
  location: "",
  bio: "",
  isAuthenticated: false,
  setName: (name: string) => set({ name }),
  setEmail: (email: string) => set({ email }),
  setAvatar: (avatar: string) => set({ avatar }),
  setTitle: (title: string) => set({ title }),
  setLocation: (location: string) => set({ location }),
  setBio: (bio: string) => set({ bio }),
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
}));

export default useProfileStore;
