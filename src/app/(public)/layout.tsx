import { NavBar } from "@/shared/ui";
import { createMetadata } from "@/shared/lib/createMetadata";

export const metadata = createMetadata(
  "Browse",
  "Explore and discover new skills",
);

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f6f7f8] text-slate-400">
      <NavBar />
      <main>{children}</main>
    </div>
  );
}
