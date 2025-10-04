import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui";

function Card() {
  return (
    <div className="bg-white border border-gray-300 rounded-2xl hover:shadow-lg max-w-[330px] transition duration-300 cursor-pointer overflow-hidden">
      <div className="relative">
        <Image
          src="/images/web-development.jpg"
          alt="Web Development"
          width={300}
          height={200}
          className="w-full h-48 rounded-t-2xl object-contain"
        />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent rounded-t-2xl"></div>
      </div>
      <div className="p-4 gap-3 flex flex-col">
        <h3 className="text-2xl font-semibold text-black">Web Development</h3>
        <p className="text-lg text-gray-500">
          Learn how to build websites and web applications.
        </p>
        <Button className="rounded-full font-medium" text="Connect" />
      </div>
    </div>
  );
}

export default Card;
