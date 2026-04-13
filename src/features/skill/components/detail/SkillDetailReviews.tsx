import React from "react";

const reviewsData = [
  {
    id: 1,
    name: "Ivan",
    time: 2,
    imageUrl: "url1",
    description: "Great skill!",
    rating: 5,
  },
  {
    id: 2,
    name: "Anna",
    time: 1,
    imageUrl: "url2",
    description: "Very helpful",
    rating: 4,
  },
];
export function StarIcon() {
  return (
    <svg
      width="20"
      height="19"
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.85 14.825L10 12.925L13.15 14.85L12.325 11.25L15.1 8.85L11.45 8.525L10 5.125L8.55 8.5L4.9 8.825L7.675 11.25L6.85 14.825ZM3.825 19L5.45 11.975L0 7.25L7.2 6.625L10 0L12.8 6.625L20 7.25L14.55 11.975L16.175 19L10 15.275L3.825 19Z"
        fill="#137FEC"
      />
    </svg>
  );
}

function SkillDetailReviews() {
  return (
    <section className="bg-white  rounded-lg p-8 shadow-md">
      <div className="flex  justify-between">
        <h2 className="text-[#0F172A] text-2xl font-bold">Reviews & Ratings</h2>
        <div className="flex gap-1">
          <StarIcon />
          <p className="text-[#137FEC] font-bold">4.9</p>
          <p className="text-[#94A3B8]">(120 reviews)</p>
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
      <button className="text-[#137FEC] text-[16px] mt-10 font-bold">
        View all reviews
      </button>
    </section>
  );
}
interface ReviewProps {
  name: string;
  time: number;
  imageUrl: string;
  description: string;
  rating: number;
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
