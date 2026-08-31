import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createMetadata } from "@/shared/lib/createMetadata";
import { SessionProvider } from "@/features/auth";
import { getSession } from "@/entities/session/session.server";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = createMetadata(
  "SkillSwap",
  "Exchange skills with others",
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Resolved on the server so the navigation renders in its final state on
  // the first paint — no logged-out flash, no layout shift after hydration.
  const session = await getSession();

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} mb-10 min-h-screen bg-surface text-black antialiased`}
      >
        <SessionProvider initial={session}>
          <Toaster position="bottom-right" />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
