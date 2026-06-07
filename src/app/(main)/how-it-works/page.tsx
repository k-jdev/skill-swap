import { createMetadata } from "@/shared/lib/createMetadata";
import { HowItWorks } from "@/features/how-it-works";

export const metadata = createMetadata(
  "How It Works",
  "Learn how SkillSwap helps you exchange skills with others",
);

export default function HowItWorksPage() {
  return <HowItWorks />;
}
