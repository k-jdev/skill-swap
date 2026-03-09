import { createMetadata } from "@/shared/lib/createMetadata";
import Header from "@/features/skill/components/Header";
import SkillForm from "@/features/skill/components/SkillForm";
export const metadata = createMetadata("Create skill", "Creating a new skill");

export default function SkillPage() {
  return (
    <section className="mx-[240px] mt-10">
      <Header />
      <div className="mt-10 min-h-screen rounded-4xl bg-white shadow-md">
        <SkillForm />
      </div>
    </section>
  );
}
