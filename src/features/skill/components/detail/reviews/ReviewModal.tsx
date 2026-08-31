"use client";

import React from "react";
import { Button, Modal } from "@/shared/ui";
import { addReview } from "@/entities/review/review.service";
import useSessionStore from "@/features/auth/model/useSessionStore";
import StarRatingInput from "./StarRatingInput";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => Promise<void>;
  skillId: number;
  skillOwnerId: string;
};

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmitted,
  skillId,
  skillOwnerId,
}: Props) {
  const [rating, setRating] = React.useState(0);
  const [content, setContent] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const userId = useSessionStore((state) => state.user?.id) ?? "";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    if (!rating || !content.trim()) {
      setError("Please provide a rating and review text.");
      return;
    }
    if (!userId) {
      setError("You must be signed in to leave a review.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // TODO: move to a server action so the author id comes from the session
    // cookie rather than the client (see docs/PROJECT_ANALYSIS.md, weakness 2).
    // RLS already rejects a mismatched author_id, so this is contained.
    const { error: submitError } = await addReview(
      userId,
      skillOwnerId,
      skillId,
      content.trim(),
      rating,
    );

    if (submitError) {
      setError("Could not submit your review. Please try again.");
      setIsSubmitting(false);
      return;
    }

    await onSubmitted();
    setContent("");
    setRating(0);
    setIsSubmitting(false);
    onClose();
  }

  return (
    <Modal title="Send your review" onClose={onClose} isOpen={isOpen}>
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <StarRatingInput value={rating} onChange={setRating} />

        <label htmlFor="review-content" className="sr-only">
          Your review
        </label>
        <textarea
          id="review-content"
          name="review"
          rows={4}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Text your review..."
          aria-invalid={error ? true : undefined}
          className="w-full resize-none rounded-lg border border-slate-300 p-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <Button type="submit" isLoading={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Modal>
  );
}
