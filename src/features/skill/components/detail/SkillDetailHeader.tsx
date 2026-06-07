"use client";
import React from "react";
import Image from "next/image";
import { Skill } from "@/entities/skill/model";

function SkillDetailHeader({ skill }: { skill: Skill | null }) {
  return (
    <div className="w-full relative mb-8">
      <Image
        src={skill?.image_url || "/images/skill/placeholder.png"}
        alt="Skill Image"
        width={1220}
        height={420}
        className="w-full h-120 object-cover rounded-2xl"
        draggable={false}
      />

      <div className="absolute bottom-6 left-6 flex flex-col gap-3">
        <div className="flex gap-2">
          {skill?.category && (
            <span className="bg-[#137FEC] rounded-full uppercase font-bold text-white text-xs py-1 px-3">
              {skill.category}
            </span>
          )}
        </div>
        <h1 className="text-white text-5xl font-bold">
          {skill?.skill_title || "Loading..."}
        </h1>
      </div>
    </div>
  );
}

export default SkillDetailHeader;
