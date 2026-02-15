import { create } from "zustand";

const useProfileStore = create((set) => ({
  name: "",
  email: "",
  avatar: "",
  setName: (name: string) => set({ name }),
  setEmail: (email: string) => set({ email }),
  setAvatar: (avatar: string) => set({ avatar }),
}));

export default useProfileStore;
