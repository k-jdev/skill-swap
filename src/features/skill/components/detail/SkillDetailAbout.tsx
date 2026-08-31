import React from "react";

import { Skill } from "@/entities/skill/model";

function SkillDetailAbout({ skill }: { skill: Skill | null }) {
  return (
    <div className="rounded-[16px] p-8 bg-white shadow-md w-full">
      <h1 className="text-slate-900 text-3xl font-bold">About this skill</h1>
      <p className="max-w-[800px] text-body">{skill?.description}</p>
    </div>
  );
}

export default SkillDetailAbout;
