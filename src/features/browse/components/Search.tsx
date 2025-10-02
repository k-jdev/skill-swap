import React from "react";
import Image from "next/image";

function Search() {
  return (
    <div className="relative mt-10">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Image
          src="/icons/search.svg"
          alt="Search"
          width={20}
          height={20}
          className="text-slate-500"
        />
      </div>
      <input
        className="w-full h-14 pl-12 pr-4 rounded-full bg-slate-200/50 focus:ring-primary border border-slate-300 dark:border-slate-700 transition-all text-slate-900 dark:text-white placeholder-slate-500"
        placeholder="Search for skills like 'Graphic Design'..."
        type="search"
      />
    </div>
  );
}

export default Search;
