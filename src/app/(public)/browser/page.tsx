"use client";
import React, { useState } from "react";
import {
  Header,
  Card,
  Search,
  SkillFilter,
} from "@/features/browse/components";

function BrowserPage() {
  // TODO: make filter logic
  // const [filters, setFilters] = useState<Record<string, boolean>>({
  //   html: false,
  //   css: false,
  // });
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <Header />
      <Search />
      <SkillFilter />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}

export default BrowserPage;
