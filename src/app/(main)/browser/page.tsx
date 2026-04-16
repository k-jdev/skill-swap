import React from "react";
import { BrowseHeader, CardGrid, Search, SkillFilter } from "@/features/browse";

export default async function BrowserPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <BrowseHeader />
      <Search />
      <SkillFilter />
      <CardGrid />
    </div>
  );
}
