"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

function Search({ query, setQuery }: any) {
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
        className="w-full h-14 pl-12 pr-4 rounded-full bg-slate-200/50  border border-slate-300  transition-all text-slate-900  placeholder-slate-500"
        placeholder="Search for skills like 'Graphic Design'..."
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}

export default Search;
