import { create } from "zustand";

const useSkillsStore = create((set) => ({
  skillTitle: "",
  skillCategory: "",
  setSkillTitle: (skillTitle: string) => set({ skillTitle }),
  setSkillCategory: (skillCategory: string) => set({ skillCategory }),
}));

export default useSkillsStore;
