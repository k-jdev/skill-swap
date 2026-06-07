import { createMetadata } from "@/shared/lib/createMetadata";
import { SkillCreateHeader, SkillForm } from "@/features/skill";
export const metadata = createMetadata("Create skill", "Creating a new skill");

export default function SkillPage() {
  return (
    <section className="mx-[240px] mt-10">
      <SkillCreateHeader />
      <div className="mt-10 min-h-screen rounded-4xl bg-white shadow-md">
        <SkillForm />
      </div>
    </section>
  );
}
