"use client";
import Header from "./Header";
import CardGrid from "./CardGrid";
import Search from "./Search";
import SkillFilter from "./SkillFilter";
import { useState, useEffect } from "react";

export default function BrowserFeature() {
  const [skillTitle, setSkillTitle] = useState("");
  const [skillCategory, setSkillCategory] = useState<string>("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSkillTitle(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, setSkillTitle]);
  return (
    <>
      <Header />
      <Search query={query} setQuery={setQuery} />
      <SkillFilter
        skillCategory={skillCategory}
        setSkillCategory={setSkillCategory}
      />
      <CardGrid skillTitle={skillTitle} skillCategory={skillCategory} />
    </>
  );
}
