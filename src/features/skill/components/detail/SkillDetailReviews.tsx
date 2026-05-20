"use client";
import React, { useCallback, useEffect, useState } from "react";

import { Button, Modal } from "@/shared/ui";
import { addReview, getReview } from "@/entities/review/review.service";
import { useProfileStore } from "@/features/profile";
import { createClient } from "@/shared/utils/supabase/client";
import dayjs from "dayjs";

//test
interface ReviewProps {
  name: string;
  time: string;
  imageUrl: string;
  description: string;
  rating: number;
}

type ReviewItem = {
  id: string;
  content: string;
  rating: number;
  created_at: string;
  author?: {
    username?: string | null;
    avatar_url?: string | null;
  } | null;
};

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
  onSubmitted: () => Promise<void>;
  skillId: number;
  skillOwnerId: string;
};

function ReviewModal({
  onClose,
  onSubmitted,
  isOpen,
  skillId,
  skillOwnerId,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const { userId } = useProfileStore();

  async function handleAddReview() {
    if (isSubmitting) return;

    if (!rating || !content.trim()) {
      setSubmitError("Please provide rating and review text");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const currentUserId = user?.id ?? userId;

    if (!currentUserId) {
      setSubmitError("Unauthorized");
      setIsSubmitting(false);
      return;
    }

    const { error } = await addReview(
      currentUserId,
      skillOwnerId,
      skillId,
      content.trim(),
      rating,
    );

    if (error) {
      setSubmitError(error.message);
      setIsSubmitting(false);
      return;
    }

    await onSubmitted();
    setContent("");
    setRating(0);
    setHoverRating(0);
    setIsSubmitting(false);
    onClose();
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
        {submitError ? (
          <p className="text-sm text-red-500">{submitError}</p>
        ) : null}
        <Button onClick={handleAddReview} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </Modal>
  );
}

function SkillDetailReviews({
  skillId,
  skillOwnerId,
}: {
  skillId: number;
  skillOwnerId: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [reviewsData, setReviewsData] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewAll, setViewAll] = useState<boolean>(false);

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    const data = await getReview(skillId);
    setReviewsData((data as ReviewItem[] | null) ?? []);
    setIsLoading(false);
  }, [skillId]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const averageRating = reviewsData.length
    ? reviewsData.reduce((acc, val) => acc + val.rating, 0) / reviewsData.length
    : 0;

  return (
    <section className="bg-white rounded-lg p-8 shadow-md">
      <div className="flex justify-between">
        <h2 className="text-[#0F172A] text-2xl font-bold">Reviews & Ratings</h2>
        <div className="flex gap-1">
          <StarIcon filled={true} />
          <p className="text-[#137FEC] font-bold">{averageRating.toFixed(1)}</p>
          <p className="text-[#94A3B8]">({reviewsData.length} reviews)</p>
        </div>
      </div>
      {isLoading ? (
        <p className="mt-4 text-[#64748B]">Loading reviews...</p>
      ) : null}
      {!isLoading && reviewsData.length === 0 ? (
        <p className="mt-4 text-[#64748B]">No reviews yet</p>
      ) : null}
      {!isLoading
        ? (viewAll ? reviewsData : reviewsData.slice(0, 3)).map((review) => (
            <Review
              key={review.id}
              name={review.author?.username || "User"}
              time={new Date(review.created_at).toLocaleDateString()}
              imageUrl={review.author?.avatar_url || ""}
              description={review.content}
              rating={review.rating}
            />
          ))
        : null}
      <div className="flex gap-2 items-center mt-10">
        <button
          onClick={() => setViewAll((prev) => !prev)}
          className="text-[#137FEC] text-[16px] font-bold"
        >
          {viewAll ? "View less" : "View all reviews"}
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
        onSubmitted={loadReviews}
      />
    </section>
  );
}

function Review({ time, name, imageUrl, description, rating }: ReviewProps) {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center">
          {imageUrl ? (
            <img className="w-10 h-10 rounded-full" src={imageUrl} alt={name} />
          ) : (
            <div
              className="w-8 h-8 rounded-full bg-[#E2E8F0]"
              aria-hidden="true"
            />
          )}
          <div className="flex flex-col">
            <p>{name}</p>
            <span>
              {Array.from({ length: rating }).map((_, index) => (
                <span key={index}>★</span>
              ))}
            </span>
          </div>
        </div>
        <p>{time}</p>
      </div>
      <h3>{description}</h3>
    </div>
  );
}

export default SkillDetailReviews;
