"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/features/browse/components";
import { getSkillAction } from "../actions";
import useSkillsStore from "@/shared/store/useSkillsStore";

function CardGrid() {
  const { skillTitle, skillCategory }: any = useSkillsStore();
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    getSkillAction(skillCategory, skillTitle).then((result) => {
      if (result && !("error" in result)) {
        setSkills(result);
      }
    });
  }, [skillTitle, skillCategory]);

  if (!skills.length) return null;
  return (
    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {skills.map((skill) => (
        <Card key={skill.id} skill={skill} />
      ))}
    </div>
  );
}

export default CardGrid;
