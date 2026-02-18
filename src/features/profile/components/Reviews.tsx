import React from "react";
import Image from "next/image";

function Reviews() {
  const ratings = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ];
  return (
    <div className="p-10  ">
      <h3 className="text-2xl font-bold">Reviews</h3>
      <div className="flex justify-between w-1/2 gap-10">
        <div className="flex-col">
          <p className="text-7xl font-bold">4.8</p>
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-blue-500 text-2xl">
              ★
            </span>
          ))}
          <p className="text-slate-400">25 reviews</p>
        </div>
        <div className="mt-4 w-full">
          {ratings.map((rating) => (
            <div key={rating.stars} className="flex items-center">
              <span className="text-sm text-black mr-2">{rating.stars}</span>
              <div className="relative w-full h-2 bg-slate-200 rounded-full">
                <div
                  className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                  style={{ width: `${rating.percentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-slate-400 ml-2">
                {rating.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
      <Response />
      <Response />
      <Response />
    </div>
  );
}

function Response() {
  return (
    <div className="mt-10  flerx-col gap-6">
      <div className="flex gap-4">
        {" "}
        <Image
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="Profile"
          width={50}
          height={50}
          className="rounded-full"
        />
        <div>
          {" "}
          <h3 className="text-xl text-black">Alex</h3>
          <p className="text-slate-500">1 month ago</p>
        </div>
      </div>
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-blue-500 text-2xl">
          ★
        </span>
      ))}
      <p className="text-slate-500 max-w-2/3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
        aliquid aliquam magnam dicta fugit animi ab dolorum voluptates fugiat
        adipisci maiores quidem, alias consectetur ex, asperiores cupiditate.
        Voluptate, error impedit?
      </p>
    </div>
  );
}

export default Reviews;
