import React from "react";
import {
  Header,
  CardGrid,
  Search,
  SkillFilter,
} from "@/features/browse/components";

export default async function BrowserPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <Header />
      <Search />
      <SkillFilter />
      <CardGrid />
    </div>
  );
}
