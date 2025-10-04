import React from "react";

function Skills() {
  return (
    <div className="px-10 py-4 border-b-2 border-slate-200 ">
      <h3 className="text-2xl font-bold">Skills offered</h3>
      <div className="mt-4">
        <SkillTag skill="Web Development" />
        <SkillTag skill="Graphic Design" />
        <SkillTag skill="Digital Marketing" />
        <SkillTag skill="Photography" />
        <SkillTag skill="Content Writing" />
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
