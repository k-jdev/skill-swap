import React from "react";
import { StarIcon } from "@/features/skill/components/icons/StarIcon";
import { reviewsData } from "@/features/skill/constants/data";
interface ReviewProps {
  name: string;
  time: number;
  imageUrl: string;
  description: string;
  rating: number;
}

function SkillDetailReviews() {
  return (
    <section className="bg-white rounded-lg p-8 shadow-md">
      <div className="flex justify-between">
        <h2 className="text-[#0F172A] text-2xl font-bold">Reviews & Ratings</h2>
        <div className="flex gap-1">
          <StarIcon />
          <p className="text-[#137FEC] font-bold">
            {reviewsData.reduce((acc, val) => acc + val.rating, 0) /
              reviewsData.length}
          </p>
          <p className="text-[#94A3B8]">({reviewsData.length} reviews)</p>
        </div>
      </div>
      {reviewsData.map((review) => (
        <Review
          key={review.id}
          name={review.name}
          time={review.time}
          imageUrl={review.imageUrl}
          description={review.description}
          rating={review.rating}
        />
      ))}
      <div className="flex gap-2 items-center mt-10">
        {" "}
        <button className="text-[#137FEC] text-[16px]  font-bold">
          View all reviews
        </button>{" "}
        <p className="">or</p>
        <button className="text-[#137FEC] text-[16px]  font-bold">
          Leave your review
        </button>
      </div>
    </section>
  );
}

function Review({ time, name, imageUrl, description, rating }: ReviewProps) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center">
          <img src={imageUrl} alt={name} />
          <div className="flex flex-col">
            <p>{name}</p>
            <span>
              {Array.from({ length: rating }).map((_, index) => (
                <span key={index}>★</span>
              ))}
            </span>
          </div>
        </div>
        <p>{time} time ago</p>
      </div>
      <h3>{description}</h3>
    </div>
  );
}

export default SkillDetailReviews;
