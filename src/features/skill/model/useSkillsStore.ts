import { create } from "zustand";

type SkillsStore = {
  skillTitle: string;
  skillCategory: string;
  setSkillTitle: (skillTitle: string) => void;
  setSkillCategory: (skillCategory: string) => void;
};

const useSkillsStore = create<SkillsStore>((set) => ({
  skillTitle: "",
  skillCategory: "",
  setSkillTitle: (skillTitle: string) => set({ skillTitle }),
  setSkillCategory: (skillCategory: string) => set({ skillCategory }),
}));

export default useSkillsStore;
