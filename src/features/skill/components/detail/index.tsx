import React from "react";
import SkillDetailHeader from "./SkillDetailHeader";
import SkillDetailAbout from "./SkillDetailAbout";
import SkillDetailReviews from "./SkillDetailReviews";
import SkillDetailProfile from "./SkillDetailProfile";
import SkillDetailBuy from "./SkillDetailBuy";
function SkillDetail({ skillId }: { skillId: string }) {
  return (
    <section>
      <SkillDetailHeader skillId={skillId} />
      <div className="flex gap-8 items-start">
        <div className="grid gap-8 flex-2">
          <SkillDetailAbout />
          <SkillDetailReviews />
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
