"use client";

import React from "react";
import {
  Header,
  Card,
  Search,
  SkillFilter,
} from "@/features/browse/components";

export default function BrowserPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <Header />
      <Search />
      <SkillFilter />
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}
