import React from "react";
import Header from "@/features/browse/components/Header";
import Search from "@/features/browse/components/Search";
type Props = {};

function BrowserPage({}: Props) {
  return (
    <div className="mx-[120px]">
      <Header />
      <Search />
    </div>
  );
}

export default BrowserPage;
