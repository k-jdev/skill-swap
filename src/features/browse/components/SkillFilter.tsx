"use client";
import React from "react";

const skills = ["All", "Design", "Programming", "Marketing", "Business"];

type SkillFilterProps = {
  skillCategory: string;
  setSkillCategory: (value: string) => void;
};

function SkillFilter({ skillCategory, setSkillCategory }: SkillFilterProps) {
  return (
    <div className="flex space-x-4 mt-5 justify-center">
      {skills.map((skill) => (
        <button
          key={skill}
          className={`px-4 py-2 rounded-full font-medium text-black hover:text-white hover:bg-primary/70   transition cursor-pointer ${
            skillCategory === skill ? "bg-primary text-white" : "bg-slate-200"
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
