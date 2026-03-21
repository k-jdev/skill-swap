"use client";
import React from "react";
import useProfileStore from "@/shared/store/useProfileStore";

function Skills() {
  const { skills } = useProfileStore();

  return (
    <div className="px-10 py-4 border-b-2 border-slate-200 ">
      <h3 className="text-2xl font-bold">Skills offered</h3>
      <div className="mt-4">
        {skills.length > 0 ? (
          skills.map((skill) => <SkillTag key={skill} skill={skill} />)
        ) : (
          <p className="text-slate-400 text-sm">No skills added yet.</p>
        )}
      </div>
    </div>
  );
}

function SkillTag({ skill }: { skill: string }) {
  return (
    <span className="inline-block cursor-pointer bg-[#137fec]/10 hover:bg-[#137fec]/20 text-[#137fec] text-sm font-medium mr-2 mb-2 py-2 px-4 rounded-full">
      {skill}
    </span>
  );
}

export default Skills;
