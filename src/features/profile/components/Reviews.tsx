"use client";
import React from "react";
import useProfileStore from "@/features/profile/model/useProfileStore";
import { Review } from "@/entities";
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= rating ? "text-blue-500 text-xl" : "text-slate-200 text-xl"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const author = Array.isArray(review.author)
    ? (review.author[0] ?? null)
    : review.author;
  const displayName = author?.username || review.author_name || "User";
  const avatarUrl = author?.avatar_url || "";

  return (
    <div className="mt-10 flex-col gap-6">
      <div className="flex gap-4">
        {avatarUrl ? (
          <img
            className="w-[50px] h-[50px] rounded-full object-cover shrink-0"
            src={avatarUrl}
            alt={displayName}
          />
        ) : (
          <div className="w-[50px] h-[50px] rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg select-none shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="text-xl text-black">{displayName}</h3>
          <p className="text-slate-500">
            {new Date(review.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <StarRating rating={review.rating} />
      <p className="text-slate-500 max-w-2/3 mt-2">{review.content}</p>
    </div>
  );
}

function Reviews() {
  const { reviews } = useProfileStore();

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const ratingBuckets = [5, 4, 3, 2, 1].map((star) => ({
    stars: star,
    percentage:
      reviews.length > 0
        ? Math.round(
            (reviews.filter((r) => r.rating === star).length / reviews.length) *
              100,
          )
        : 0,
  }));

  return (
    <div className="p-10">
      <h3 className="text-2xl font-bold">Reviews</h3>

      {reviews.length > 0 ? (
        <>
          <div className="flex justify-between w-1/2 gap-10 mt-4">
            <div className="flex-col">
              <p className="text-7xl font-bold">{avgRating.toFixed(1)}</p>
              <StarRating rating={Math.round(avgRating)} />
              <p className="text-slate-400">{reviews.length} reviews</p>
            </div>
            <div className="mt-4 w-full">
              {ratingBuckets.map((bucket) => (
                <div key={bucket.stars} className="flex items-center">
                  <span className="text-sm text-black mr-2">
                    {bucket.stars}
                  </span>
                  <div className="relative w-full h-2 bg-slate-200 rounded-full">
                    <div
                      className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                      style={{ width: `${bucket.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-400 ml-2">
                    {bucket.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </>
      ) : (
        <p className="text-slate-400 text-sm mt-4">No reviews yet.</p>
      )}
    </div>
  );
}

export default Reviews;
