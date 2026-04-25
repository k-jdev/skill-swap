"use client";
import React, { useState } from "react";

import { Button, Modal } from "@/shared/ui";
import { addReview } from "@/entities/review/review.service";
import { useProfileStore } from "@/features/profile";
import { createClient } from "@/shared/utils/supabase/client";

interface ReviewProps {
  name: string;
  time: number;
  imageUrl: string;
  description: string;
  rating: number;
}

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

export function StarIcon({ filled }: { filled?: boolean }) {
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
        fill={filled ? "#137FEC" : "#CBD5E1"}
      />
    </svg>
  );
}

type ReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  skillId: number;
  skillOwnerId: number;
};

function ReviewModal({
  onClose,
  isOpen,
  skillId,
  skillOwnerId,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [content, setContent] = useState<string>("");
  const { userId } = useProfileStore();

  async function handleAddReview() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const currentUserId = user?.id ?? userId;
    await addReview(currentUserId, skillOwnerId, skillId, content, rating);
  }

  return (
    <Modal title="Send your review" onClose={onClose} isOpen={isOpen}>
      <div className="grid gap-2">
        <span className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => {
            const starValue = index + 1;
            return (
              <span
                key={index}
                className="cursor-pointer"
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(starValue)}
              >
                <StarIcon filled={starValue <= (hoverRating || rating)} />
              </span>
            );
          })}
        </span>
        <textarea
          className="w-full"
          name="review"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Text your review..."
        ></textarea>
        <Button onClick={handleAddReview}>Submit</Button>
      </div>
    </Modal>
  );
}

function SkillDetailReviews({
  skillId,
  skillOwnerId,
}: {
  skillId: number;
  skillOwnerId: number;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <section className="bg-white rounded-lg p-8 shadow-md">
      <div className="flex justify-between">
        <h2 className="text-[#0F172A] text-2xl font-bold">Reviews & Ratings</h2>
        <div className="flex gap-1">
          <StarIcon filled={true} />
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
        <button className="text-[#137FEC] text-[16px] font-bold">
          View all reviews
        </button>
        <p>or</p>
        <button
          onClick={() => setIsOpen(true)}
          className="text-[#137FEC] text-[16px] font-bold"
        >
          Send your review
        </button>
      </div>
      <ReviewModal
        skillOwnerId={skillOwnerId}
        skillId={skillId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
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
