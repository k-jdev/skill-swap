import React from "react";
import SkillDetailHeader from "./SkillDetailHeader";
import SkillDetailAbout from "./SkillDetailAbout";
import SkillDetailReviews from "./SkillDetailReviews";
import SkillDetailProfile from "./SkillDetailProfile";
import SkillDetailBuyClient from "./SkillDetailBuy";
import { getSkill } from "@/features/skill/api/skill.service";
import { getSkillProfile } from "@/features/skill/api/skill.server";

async function SkillDetail({ skillId }: { skillId: number }) {
  const [skill, profileData] = await Promise.all([
    getSkill(skillId),
    getSkillProfile(skillId),
  ]);
  const profile = profileData?.profiles ?? null;

  return (
    <section>
      <SkillDetailHeader skill={skill} />
      <div className="flex gap-8 items-start">
        <div className="grid gap-8 flex-2">
          <SkillDetailAbout skill={skill} />
          <SkillDetailReviews skillId={skillId} skillOwnerId={skill?.user_id} />
        </div>
        <div className="flex flex-col flex-1 shrink-0">
          <div className="mb-6">
            <SkillDetailBuy
              skill={skill}
              profileUsername={profile?.username ?? null}
            />
          </div>
          <SkillDetailProfile profile={profile} />
        </div>
      </div>
    </section>
  );
}

export default SkillDetail;
