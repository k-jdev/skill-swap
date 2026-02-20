"use client";
import React from "react";
import Image from "next/image";
import useProfileStore from "@/shared/store/useProfileStore";
function UserInfo() {
  const { name, email, avatar } = useProfileStore();
  return (
    <div className="p-10 flex justify-between gap-10 border-b-2 border-slate-200 ">
      {avatar ? (
        <Image
          src={avatar}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover "
        />
      ) : (
        <div className="w-[30%] h-[300px] rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold ">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex-col space-y-2  w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-5xl font-bold">{name}</h2>
          <button className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            Edit Profile
          </button>
        </div>
        <p className="text-slate-500 text-[20px]">Email: {email}</p>
        <p className="text-slate-500 text-[20px]">Product Designer</p>
        <p className="text-slate-400 text-[18px]">San Francisco, CA</p>
        <p className="mt-4 text-slate-500 max-w-2/3 text-[18px]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat{" "}
          possimus quidem enim, veniam expedita natus velit, iusto quas cumque{" "}
          doloremque eveniet corrupti deleniti beatae vitae incidunt
          necessitatibus deserunt cupiditate modi?
        </p>
      </div>
    </div>
  );
}

export default UserInfo;
