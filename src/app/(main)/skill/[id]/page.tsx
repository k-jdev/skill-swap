import SkillDetail from "@/features/skill/components/detail";
import { createMetadata } from "@/shared/lib/createMetadata";
export const metadata = createMetadata("Skill Detail", "Viewing skill details");
export default async function SkillPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <section className="mx-20 mt-10">
      <SkillDetail skillId={id} />
    </section>
  );
}
