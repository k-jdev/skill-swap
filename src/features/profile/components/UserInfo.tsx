import React from "react";
import Image from "next/image";

function UserInfo() {
  return (
    <div className="p-10 flex justify-between gap-10 border-b-2 border-slate-200 ">
      <Image
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt="Profile"
        width={220}
        height={100}
        className="rounded-full"
      />
      <div className="flex-col space-y-2  w-full">
        <h2 className="text-5xl font-bold">Alex Adams</h2>
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
