import React from "react";
import Image from "next/image";
type Props = {};

function SkillDetailProfile({}: Props) {
  const status = true;
  return (
    <div className="rounded-[16px] p-8 bg-white shadow-md w-full">
      <h2 className="text-[#0F172A] font-bold text-2xl">Teacher Profile</h2>
      <div className="flex justify-center items-center">
        <Image src={"/images/bg.png"} alt="ds" width={64} height={64} />
        <span>
          {status ? (
            <span className="bg-green-500 rounded-full w-2"> </span>
          ) : (
            <span className="bg-gray-600 rounded-full w-2"> </span>
          )}
        </span>
      </div>
      <div className="grid gap-2  justify-center text-center">
        <h4 className="text-[#0F172A] font-bold text-xl">Alex Rivers</h4>
        <p className="text-[#64748B] text-[14px]">Senior Frontend Developer</p>
      </div>
      <div className="flex justify-around text-center">
        <div className="grid gap-2 justify-center">
          <p className="text-[#137FEC]  font-bold">4.9</p>
          <p className="text-[#94A3B8] font-bold text-sm">Rating</p>
        </div>
        <div className="grid gap-2 justify-center ">
          <p className="text-[#0F172A]  font-bold">42</p>
          <p className="text-[#94A3B8] font-bold text-sm">Students</p>
        </div>
      </div>
      <p className="text-[#475569] text-sm justify-center text-center">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
        tempore omnis tenetur corrupti. Id culpa cumque ab animi? Vel, esse
        consectetur? Facere earum atque eius ab perspiciatis quam necessitatibus
        esse!
      </p>
      <div className="flex justify-center text-center">
        {" "}
        <button className="">View profile</button>
      </div>
    </div>
  );
}

export default SkillDetailProfile;
