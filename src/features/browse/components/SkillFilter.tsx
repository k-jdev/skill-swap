import React from "react";

const skills = ["All", "Design", "Development", "Marketing", "Business"];

function SkillFilter() {
  return (
    <div className="flex space-x-4 mt-5 justify-center">
      {skills.map((skill) => (
        <button
          key={skill}
          className="px-4 py-2 rounded-full font-medium text-black hover:text-white bg-slate-200 hover:bg-[#137fec] transition cursor-pointer"
        >
          {skill}
        </button>
      ))}
    </div>
  );
}

export default SkillFilter;
