"use client";
import React from "react";
import useSkillsStore from "@/shared/store/useSkillsStore";
const skills = ["All", "Design", "Programming", "Marketing", "Business"];

function SkillFilter() {
  const { skillCategory, setSkillCategory }: any = useSkillsStore();
  return (
    <div className="flex space-x-4 mt-5 justify-center">
      {skills.map((skill) => (
        <button
          key={skill}
          className={`px-4 py-2 rounded-full font-medium text-black hover:text-white hover:bg-[#137fec]/70   transition cursor-pointer ${
            skillCategory === skill ? "bg-[#137fec] text-white" : "bg-slate-200"
          }`}
          onClick={() => setSkillCategory(skill)}
        >
          {skill}
        </button>
      ))}
    </div>
  );
}

export default SkillFilter;
