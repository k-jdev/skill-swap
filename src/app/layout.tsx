import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createMetadata } from "@/shared/lib/createMetadata";
import { AuthInitializer } from "@/shared/ui/AuthInitializer";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#f6f7f8] text-black`}
      >
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}
