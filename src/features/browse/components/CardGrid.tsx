"use client";
import React, { useEffect, useState } from "react";
import Card from "./Card";
import { getSkillAction } from "../actions";
import { Skill } from "@/entities";
import CardSkeleton from "./CardSkeleton";

function CardGrid({ skillTitle, skillCategory }: any) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getSkillAction(skillCategory, skillTitle).then((result) => {
      if (result.success && "data" in result) {
        setSkills(result.data);
      } else {
        console.error(result.error);
      }
      setIsLoading(false);
    });
  }, [skillTitle, skillCategory]);

  if (isLoading) {
    return (
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!skills.length)
    return (
      <div className="flex justify-center mt-20">
        <h2 className="text-3xl">Skills not found</h2>
      </div>
    );

  return (
    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {skills.map((skill) => (
        <Card key={skill.id} skill={skill} />
      ))}
    </div>
  );
}

export default CardGrid;
