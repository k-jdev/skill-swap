"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getSkill } from "@/shared/utils/skill/services/skill.service";

interface Skill {
  skill_title: string;
  category: string;
  image_url: string;
  [key: string]: unknown;
}

function SkillDetailHeader({ skillId }: { skillId: string }) {
  const [skill, setSkill] = useState<Skill | null>(null);

  useEffect(() => {
    getSkill(skillId)
      .then((skill) => {
        setSkill(skill);
      })
      .catch((e) => {
        console.error("Error while fetching skill:", e);
      });
  }, [skillId]);
  return (
    <div className="w-full relative mb-8">
      <Image
        src={skill?.image_url || "/images/skill/placeholder.png"}
        alt="Skill Image"
        width={1220}
        height={1080}
        className="w-full h-70% object-contain rounded-2xl"
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
