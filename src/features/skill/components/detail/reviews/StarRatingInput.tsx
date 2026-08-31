"use client";

import React from "react";
import { StarIcon } from "../../icons/StarIcon";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

/**
 * Keyboard-operable star picker: each star is a real radio input, so arrow
 * keys work and screen readers announce "3 stars" instead of a bare graphic.
 */
export default function StarRatingInput({ value, onChange }: Props) {
  const [hovered, setHovered] = React.useState(0);

  return (
    <fieldset className="border-0 p-0">
      <legend className="sr-only">Rating</legend>
      <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <label
            key={star}
            className="cursor-pointer"
            onMouseEnter={() => setHovered(star)}
          >
            <input
              type="radio"
              name="rating"
              value={star}
              checked={value === star}
              onChange={() => onChange(star)}
              className="sr-only"
            />
            <span className="block focus-within:outline-none">
              <StarIcon filled={star <= (hovered || value)} />
            </span>
            <span className="sr-only">{`${star} star${star > 1 ? "s" : ""}`}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
