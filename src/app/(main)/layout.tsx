import { NavBar } from "@/widgets";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
}
