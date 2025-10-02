import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui";

function Card() {
  return (
    <div className="border border-gray-300 rounded-2xl hover:shadow-lg max-w-[320px] transition duration-300 cursor-pointer">
      <Image
        src="/images/web-development.png"
        alt="Web Development"
        width={300}
        height={200}
        className="w-full rounded-t-lg object-cover"
      />
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
