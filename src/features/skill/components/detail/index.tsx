import React from "react";
import SkillDetailHeader from "./SkillDetailHeader";
import SkillDetailAbout from "./SkillDetailAbout";
import SkillDetailReviews from "./SkillDetailReviews";
function SkillDetail({ skillId }: { skillId: string }) {
  return (
    <section>
      <SkillDetailHeader skillId={skillId} />
      <div className="flex gap-8 ">
        <div className="grid gap-8 ">
          <SkillDetailAbout />
          <SkillDetailReviews />
        </div>
      </div>
    </section>
  );
}

export default SkillDetail;
