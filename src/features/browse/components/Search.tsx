import React from "react";

type Props = {};

function Search({}: Props) {
  return (
    <input
      className="w-full h-14 pl-12 pr-4 rounded-full bg-slate-200/50 focus:ring-[#137fec] border border-slate-300 dark:border-slate-700  transition-all text-slate-900 dark:text-white placeholder-slate-500"
      placeholder="Search for skills like 'Graphic Design'..."
      type="search"
    />
  );
}

export default Search;
