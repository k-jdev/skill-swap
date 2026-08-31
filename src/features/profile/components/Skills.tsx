"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useProfileStore from "@/features/profile/model/useProfileStore";
import { SKILL_CATEGORIES } from "@/shared/constants/categories";
import { addSkillAction, removeSkillAction } from "@/features/skill/actions";

function Skills() {
  const skills = useProfileStore((state) => state.skills);
  const isEditing = useProfileStore((state) => state.isEditing);
  const setProfile = useProfileStore((state) => state.setProfile);
  const router = useRouter();

  const [selected, setSelected] = React.useState(
    SKILL_CATEGORIES[0]?.value ?? "",
  );
  const [isPending, setIsPending] = React.useState(false);

  async function handleAdd() {
    if (!selected || skills.includes(selected)) return;

    setIsPending(true);
    const result = await addSkillAction(selected);
    setIsPending(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    setProfile({ skills: [...skills, selected] });
    toast.success("Skill added");
    router.refresh();
  }

  async function handleRemove(skill: string) {
    const previous = skills;
    // Optimistic: the list is small and the action is idempotent, so a
    // failure simply restores the previous array.
    setProfile({ skills: skills.filter((s) => s !== skill) });

    const result = await removeSkillAction(skill);
    if (!result.success) {
      setProfile({ skills: previous });
      toast.error(result.error);
      return;
    }

    toast.success("Skill removed");
    router.refresh();
  }

  return (
    <div className="border-b-2 border-slate-200 px-6 py-4 sm:px-10">
      <h3 className="text-2xl font-bold">Skills offered</h3>
      <div className="mt-4">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <SkillTag
              key={skill}
              skill={skill}
              isEditing={isEditing}
              onRemove={handleRemove}
            />
          ))
        ) : (
          <p className="text-sm text-slate-500">No skills added yet.</p>
        )}
      </div>

      {isEditing && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label htmlFor="skill-picker" className="sr-only">
            Choose a skill to add
          </label>
          <select
            id="skill-picker"
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {SKILL_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAdd}
            disabled={isPending || skills.includes(selected)}
            className="cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Adding..." : "Add skill"}
          </button>
        </div>
      )}
    </div>
  );
}

function SkillTag({
  skill,
  isEditing,
  onRemove,
}: {
  skill: string;
  isEditing: boolean;
  onRemove: (skill: string) => void;
}) {
  const label = SKILL_CATEGORIES.find((c) => c.value === skill)?.label ?? skill;

  return (
    <span className="mr-2 mb-2 inline-flex items-center gap-1 rounded-full bg-primary-soft px-4 py-2 text-sm font-medium text-primary">
      {label}
      {isEditing && (
        <button
          type="button"
          onClick={() => onRemove(skill)}
          className="ml-1 cursor-pointer leading-none transition-colors hover:text-red-600"
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
}

export default Skills;
