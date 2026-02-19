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
        <h2 className="text-5xl font-bold">{name}</h2>
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
