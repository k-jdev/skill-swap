import React from "react";
import { Button } from "@/shared/ui";
import Link from "next/link";

function Header() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f6f7f8] to-indigo-100 overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f6f7f8]" />

      <div className="absolute bottom-20 left-10 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-10 right-20 w-80 h-80 bg-indigo-400 rounded-full blur-3xl opacity-25" />
      <div className="absolute bottom-32 left-1/3 w-48 h-48 bg-blue-300 rounded-full blur-3xl opacity-20" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Unlock Your Potential.
            <br />
            <span className="text-[#137fec]">Share Your Skills.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-8">
            Join a vibrant community of learners and creators. Exchange
            knowledge, master new abilities, and connect with passionate
            individuals from <br /> around the world.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/browser">
              {" "}
              <Button
                text="Find a Skill"
                className="px-8 py-3 text-lg rounded-[24px] font-bold shadow-md max-w-[160px]"
              />
            </Link>
            <button className="text-gray-800 font-bold text-lg hover:text-primary transition-colors duration-200 flex items-center gap-2">
              Offer Your Skills
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
