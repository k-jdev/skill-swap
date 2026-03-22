"use client";
import React from "react";
import useProfileStore from "@/shared/store/useProfileStore";
import { createClient } from "@/shared/utils/supabase/client";
import { SKILL_CATEGORIES } from "@/shared/constants/categories";

function Skills() {
  const { skills, isEditing, userId, setProfile } = useProfileStore();
  const [selected, setSelected] = React.useState(
    SKILL_CATEGORIES[0]?.value ?? "",
  );

  async function handleAdd() {
    if (!selected || skills.includes(selected)) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("skills")
      .insert({ user_id: userId, skill_title: selected });
    if (!error) {
      setProfile({ skills: [...skills, selected] });
    }
  }

  async function handleRemove(skill: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("skills")
      .delete()
      .eq("user_id", userId)
      .eq("skill_title", skill);
    if (!error) {
      setProfile({ skills: skills.filter((s) => s !== skill) });
    }
  }

  return (
    <div className="px-10 py-4 border-b-2 border-slate-200">
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
          <p className="text-slate-400 text-sm">No skills added yet.</p>
        )}
      </div>

      {isEditing && (
        <div className="mt-4 flex items-center gap-3">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          >
            {SKILL_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={skills.includes(selected)}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add skill
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
    <span className="inline-flex items-center gap-1 bg-[#137fec]/10 text-[#137fec] text-sm font-medium mr-2 mb-2 py-2 px-4 rounded-full">
      {label}
      {isEditing && (
        <button
          onClick={() => onRemove(skill)}
          className="ml-1 hover:text-red-500 transition-colors leading-none"
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
}

export default Skills;
