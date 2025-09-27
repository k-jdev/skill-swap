import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth | SkillSwap",
  description: "Sign in or create an account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-[#f6f7f8] text-[#64748b]">
      <div className="container mx-auto px-4">
        <div className="flex min-h-svh items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
