import { createMetadata } from "@/shared/lib/createMetadata";

export const metadata = createMetadata("Auth", "Sign in or create an account");

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-svh items-center justify-center text-slate-500">
      <div className="w-full max-w-md px-4">{children}</div>
    </main>
  );
}
