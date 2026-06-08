import React from "react";
import Image from "next/image";
import { Button } from "@/shared/ui";

import Link from "next/link";
import { Skill } from "@/entities";

interface CardProps {
  skill: Skill;
}

function Card({ skill }: CardProps) {
  return (
    <>
      {" "}
      <div className="bg-white border border-gray-200 rounded-2xl hover:shadow-lg max-w-[330px] transition duration-300  overflow-hidden">
        <div className="relative">
          <Image
            src={skill.image_url}
            alt={skill.skill_title}
            width={300}
            height={200}
            className="w-full h-48 rounded-t-2xl object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent rounded-t-2xl"></div>
        </div>
        <div className="p-4 gap-3 flex flex-col">
          <h3 className="text-2xl font-semibold text-black">
            {skill.skill_title}
          </h3>
          <p className="text-lg text-gray-500">{skill.description}</p>
          <Link href={`/skill/${skill.id}`} className="block">
            <Button className="rounded-full font-medium" text="Connect" />
          </Link>
        </div>
      </div>
    </>
  );
}

export default Card;
