import type { Metadata } from "next";
import { NavBar } from "@/components/ui";

export const metadata: Metadata = {
  title: "Browse | SkillSwap",
  description: "Explore and discover new skills",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f6f7f8] text-black">
      <NavBar />
      <main>{children}</main>
    </div>
  );
}
