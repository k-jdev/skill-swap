import { createMetadata } from "@/shared/lib/createMetadata";
import { HomeHeader } from "@/features/home";

export const metadata = createMetadata("Home", "Exchange skills with others");

export default function HomePage() {
  return <HomeHeader />;
}
