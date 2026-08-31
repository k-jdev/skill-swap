import { SkillDetail } from "@/features/skill";
import { createMetadata } from "@/shared/lib/createMetadata";

export const metadata = createMetadata("Skill Detail", "Viewing skill details");

export default async function SkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section className="mx-auto mt-10 w-full max-w-6xl px-4">
      <SkillDetail skillId={Number(id)} />
    </section>
  );
}
