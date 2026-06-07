import React from "react";
import Link from "next/link";
import { Button } from "@/shared/ui";

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description:
      "Sign up and tell the community what skills you have to offer and what you want to learn. Your profile is your identity on SkillSwap.",
  },
  {
    number: "02",
    title: "Browse or Post Skills",
    description:
      "Explore hundreds of skills offered by other members, or post your own skill to attract learners who are interested in what you know.",
  },
  {
    number: "03",
    title: "Connect & Exchange",
    description:
      "Reach out to someone whose skill interests you. Propose an exchange — you teach them something, they teach you something in return.",
  },
  {
    number: "04",
    title: "Learn & Grow",
    description:
      "Complete your sessions, leave reviews, and build a reputation. The more you share, the more you gain from the community.",
  },
];

export function HowItWorks() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden py-24 px-4 text-left">
        <div className="relative z-10 max-w-7xl mx-auto">
          <span className="text-[#137FEC] bg-[#137FEC]/10 p-1 font-bold rounded-full">
            The Exchange Economy
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 mt-2">
            How SkillSwap Works
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-8">
            SkillSwap is built on a simple idea — everyone knows something worth
            teaching. Follow these four steps to start exchanging skills with
            people around the world.
          </p>
          <div>
            <Button text="Get Started" />
            <Button text="Watch video" />
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-5xl mx-auto px-4 pb-24">
        <div className="grid gap-8 md:grid-cols-2">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <span className="text-5xl font-extrabold text-indigo-100 leading-none">
                {step.number}
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-2 mb-3">
                {step.title}
              </h2>
              <p className="text-gray-600 leading-7">{step.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 text-lg mb-6">Ready to get started?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button
                text="Join for Free"
                className="px-8 py-3 text-lg rounded-[24px] font-bold shadow-md"
              />
            </Link>
            <Link href="/browser">
              <button className="text-gray-800 font-bold text-lg hover:text-[#137fec] transition-colors duration-200 flex items-center gap-2 cursor-pointer">
                Browse Skills
                <span>→</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
