import { createMetadata } from "@/shared/lib/createMetadata";

export const metadata = createMetadata("Learn", "Learn new skills");

export default function LearnPage() {
  return (
    <div>
      <h1>Learn Page</h1>
      <p>This is the learn page.</p>
    </div>
  );
}
