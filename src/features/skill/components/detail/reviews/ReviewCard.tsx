import React from "react";
import Image from "next/image";
import { StarIcon } from "../../icons/StarIcon";
import type { ReviewItem } from "@/entities/review/model";

export default function ReviewCard({ review }: { review: ReviewItem }) {
  const name = review.author?.username || "User";
  const avatarUrl = review.author?.avatar_url || "";
  const date = new Date(review.created_at).toLocaleDateString();

  return (
    <article className="mt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {avatarUrl ? (
            <Image
              className="h-10 w-10 rounded-full object-cover"
              src={avatarUrl}
              alt=""
              width={40}
              height={40}
            />
          ) : (
            <div
              className="flex h-10 w-10 select-none items-center justify-center rounded-full bg-primary text-sm font-semibold text-white"
              aria-hidden
            >
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <p className="font-medium">{name}</p>
            <span
              className="flex gap-0.5"
              aria-label={`${review.rating} out of 5 stars`}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} filled={star <= review.rating} />
              ))}
            </span>
          </div>
        </div>
        <time className="text-sm text-muted">{date}</time>
      </div>
      <p className="mt-2 text-body">{review.content}</p>
    </article>
  );
}
