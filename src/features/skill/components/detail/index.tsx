import React from "react";
import SkillDetailHeader from "./SkillDetailHeader";
function SkillDetail({ skillId }: { skillId: string }) {
  return (
    <section>
      <SkillDetailHeader skillId={skillId} />
    </section>
  );
}

export default SkillDetail;
