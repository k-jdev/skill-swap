import React from "react";
import Header from "@/features/browse/components/Header";
import Search from "@/features/browse/components/Search";
import SkillFilter from "@/features/browse/components/SkillFilter";
import Card from "@/features/browse/components/Card";

function BrowserPage() {
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
