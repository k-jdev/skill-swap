import type { Metadata } from "next";

export function createMetadata(
  title: string,
  description?: string,
  image?: string,
): Metadata {
  return {
    title: `${title} | SkillSwap`,
    description: description ?? "Exchange skills with others",
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : [],
    },
  };
}
