import React from "react";
import { Card } from "@/features/browse/components";
import { getSkillAction } from "../actions";

async function CardGrid() {
  const skills = await getSkillAction();
  console.log("skills:", skills);
  if (!skills || "error" in skills) return null;
  return (
    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {skills.map((skill) => (
        <Card key={skill.id} skill={skill} />
      ))}
    </div>
  );
}

export default CardGrid;
