import { createMetadata } from "@/shared/lib/createMetadata";
import Header from "@/features/home/components/Header";

export const metadata = createMetadata("Home", "Exchange skills with others");

export default function HomePage() {
  return <Header />;
}
