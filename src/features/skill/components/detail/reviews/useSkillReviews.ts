"use client";

import { useCallback, useEffect, useState } from "react";
import { getReview } from "@/entities/review/review.service";
import type { ReviewItem } from "@/entities/review/model";

/** Loads the reviews for one skill and exposes a reload for after a submit. */
export function useSkillReviews(skillId: number) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    setIsLoading(true);
    const data = await getReview(skillId);
    setReviews((data as ReviewItem[] | null) ?? []);
    setIsLoading(false);
  }, [skillId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const averageRating = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : 0;

  return { reviews, isLoading, averageRating, reload };
}
