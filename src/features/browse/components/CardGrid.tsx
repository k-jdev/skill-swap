"use client";
import React, { useEffect, useState } from "react";
import Card from "./Card";
import { getSkillAction } from "../actions";
import { Skill } from "@/entities";

type CardGridProps = {
  skillTitle: string;
  skillCategory: string;
};

function CardGrid({ skillTitle, skillCategory }: CardGridProps) {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    getSkillAction(skillCategory, skillTitle).then((result) => {
      if (result.success && "data" in result) {
        setSkills(result.data);
      } else {
        console.error(result.error);
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
