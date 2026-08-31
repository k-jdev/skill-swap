"use client";

import React from "react";
import { StarIcon } from "../icons/StarIcon";
import ReviewCard from "./reviews/ReviewCard";
import ReviewModal from "./reviews/ReviewModal";
import { useSkillReviews } from "./reviews/useSkillReviews";

const PREVIEW_COUNT = 3;

export default function SkillDetailReviews({
  skillId,
  skillOwnerId,
}: {
  skillId: number;
  skillOwnerId: string;
}) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [showAll, setShowAll] = React.useState(false);
  const { reviews, isLoading, averageRating, reload } = useSkillReviews(skillId);

  const visible = showAll ? reviews : reviews.slice(0, PREVIEW_COUNT);
  const hasMore = reviews.length > PREVIEW_COUNT;

  return (
    <section className="rounded-lg bg-white p-8 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold text-slate-900">Reviews &amp; Ratings</h2>
        <div className="flex items-center gap-1">
          <StarIcon filled />
          <p className="font-bold text-primary">{averageRating.toFixed(1)}</p>
          <p className="text-muted">({reviews.length} reviews)</p>
        </div>
      </div>

      {isLoading && <p className="mt-4 text-muted">Loading reviews...</p>}

      {!isLoading && reviews.length === 0 && (
        <p className="mt-4 text-muted">
          No reviews yet — be the first to leave one.
        </p>
      )}

      {!isLoading &&
        visible.map((review) => <ReviewCard key={review.id} review={review} />)}

      <div className="mt-10 flex flex-wrap items-center gap-2">
        {hasMore && (
          <>
            <button
              type="button"
              onClick={() => setShowAll((current) => !current)}
              className="cursor-pointer text-[16px] font-bold text-primary"
            >
              {showAll ? "View less" : "View all reviews"}
            </button>
            <p>or</p>
          </>
        )}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer text-[16px] font-bold text-primary"
        >
          Send your review
        </button>
      </div>

      <ReviewModal
        skillId={skillId}
        skillOwnerId={skillOwnerId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitted={reload}
      />
    </section>
  );
}
