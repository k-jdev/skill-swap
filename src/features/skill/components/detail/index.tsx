import React from "react";
import SkillDetailHeader from "./SkillDetailHeader";
import SkillDetailAbout from "./SkillDetailAbout";
import SkillDetailReviews from "./SkillDetailReviews";
import SkillDetailProfile from "./SkillDetailProfile";
import SkillDetailBuy from "./SkillDetailBuy";
import { getSkill } from "@/features/skill/api/skill.service";

async function SkillDetail({ skillId }: { skillId: number }) {
  const skill = await getSkill(skillId);
  return (
    <section>
      <SkillDetailHeader skillId={skillId} />
      <div className="flex gap-8 items-start">
        <div className="grid gap-8 flex-2">
          <SkillDetailAbout />
          <SkillDetailReviews skillId={skillId} skillOwnerId={skill?.user_id} />
        </div>
        <div className="flex flex-col flex-1  shrink-0">
          <div className="mb-6">
            <SkillDetailBuy />
          </div>
          <SkillDetailProfile />
        </div>
      </div>
    </section>
  );
}

export default SkillDetail;
