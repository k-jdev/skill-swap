import React from "react";
import Link from "next/link";

import {
  CreateProfileIcon,
  BrowseSkillsIcon,
  RequestSwapIcon,
  StartLearningIcon,
  VerifiedExpertsIcon,
  SecurePlatformIcon,
  FlexibleSchedulingIcon,
} from "@/shared/ui/icons";

const steps = [
  {
    number: "01",
    icon: <CreateProfileIcon />,
    title: "Create Profile",
    description:
      "Set up your profile by listing the skills you currently master and those you're eager to learn.",
  },
  {
    number: "02",
    icon: <BrowseSkillsIcon />,
    title: "Browse Skills",
    description:
      "Explore thousands of verified experts. Filter by category, level, or availability to find your perfect match.",
  },
  {
    number: "03",
    icon: <RequestSwapIcon />,
    title: "Request Swap",
    description:
      "Send an exchange proposal. Discuss goals and schedule sessions through our secure messaging system.",
  },
  {
    number: "04",
    icon: <StartLearningIcon />,
    title: "Start Learning",
    description:
      "Begin your journey to mastery. Trade time and knowledge to grow professionally without the cost.",
  },
];

const features = [
  {
    icon: <VerifiedExpertsIcon />,
    color: "bg-green-100 text-green-600",
    title: "Verified Experts",
    description:
      "Every mentor is reviewed by the community to ensure high-quality educational experiences.",
  },
  {
    icon: <SecurePlatformIcon />,
    color: "bg-blue-100 text-blue-600",
    title: "Secure Platform",
    description:
      "Your data and communications are encrypted and private, ensuring a safe learning environment.",
  },
  {
    icon: <FlexibleSchedulingIcon />,
    color: "bg-yellow-100 text-yellow-600",
    title: "Flexible Scheduling",
    description:
      "Coordinate sessions that fit your busy life. Learn at your own pace, on your own terms.",
  },
];

export function HowItWorks() {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden py-24 px-4">
        <div className="relative z-10 max-w-7xl mx-auto">
          <span className="inline-block text-primary bg-primary/10 px-3 py-1 text-sm font-bold rounded-full mb-4">
            THE EXCHANGE ECONOMY
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
            How SkillSwap Works
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed mb-8">
            Master new skills through community-driven exchange. Our platform
            connects passionate learners with experts. No fees, just pure
            knowledge sharing.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/register">
              <button className="bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors duration-200">
                Get Started Today
              </button>
            </Link>
            <button className="bg-white text-gray-700 font-bold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200">
              Watch Video
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-bold text-gray-200">
                    {step.number}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why choose SkillSwap?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for professionals who believe in collaborative growth and
              community learning.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="relative bg-gradient-to-br from-primary to-primary-active rounded-3xl p-12 overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to swap your first skill?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl">
                Join over 50,000 learners and experts who are changing the way
                the world learns. It&apos;s free, it&apos;s fast, and it&apos;s
                transformative.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <button className="bg-white text-primary font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    Create Your Profile
                  </button>
                </Link>
                <Link href="/browser">
                  <button className="bg-transparent text-white font-bold py-3 px-8 rounded-xl border-2 border-white/30 hover:bg-white/10 transition-colors duration-200">
                    Browse Skills
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
