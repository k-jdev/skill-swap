"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/shared/ui";
import { useRouter } from "next/navigation";

type Profile = {
  username?: string;
  avatar_url?: string;
  description?: string;
  id?: string;
} | null;

function SkillDetailProfile({ profile }: { profile: Profile }) {
  const status = true;

  const router = useRouter();
  function handleViewProfile() {
    router.push(`/profile/${profile?.id}`);
  }

  return (
    <div className="rounded-[16px] p-8 bg-white shadow-md w-full text-center">
      <h2 className="text-slate-900 font-bold text-2xl text-center pb-4">
        Teacher Profile
      </h2>
      <div className="flex justify-center items-center">
        <Image
          src={profile?.avatar_url || "/images/skill/placeholder.png"}
          className="rounded-full"
          alt="ds"
          width={64}
          height={64}
          draggable={false}
        />
        <span>
          {status ? (
            <span className="bg-green-500 rounded-full w-2"> </span>
          ) : (
            <span className="bg-gray-600 rounded-full w-2"> </span>
          )}
        </span>
      </div>
      <div className="grid gap-2  justify-center text-center">
        <h4 className="text-slate-900 font-bold text-xl">
          {profile?.username}
        </h4>
        <p className="text-muted text-[14px] font-semibold">
          Senior Frontend Developer
        </p>
      </div>
      <div className="flex justify-around text-center py-2">
        <div className="grid  justify-center">
          <p className="text-primary  font-bold">4.9</p>
          <p className="text-muted font-bold text-sm">Rating</p>
        </div>
        <div className="grid  justify-center ">
          <p className="text-slate-900  font-bold">42</p>
          <p className="text-muted font-bold text-sm">Students</p>
        </div>
      </div>
      <p className="text-body text-sm justify-center text-center py-2">
        {profile?.description}
      </p>
      <div className="flex justify-center text-center">
        <Button onClick={handleViewProfile} className="max-w-fit">
          View profile
        </Button>
      </div>
    </div>
  );
}

export default SkillDetailProfile;
