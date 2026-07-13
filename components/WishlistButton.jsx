"use client";
// components/WishlistButton.jsx — the heart. Toggles a product in/out of the
// wishlist and fires an `add_to_wishlist` analytics event on save.
//
// Renders nothing until the store has read localStorage (`ready`), because the
// filled/empty state can't be known during SSR. Rendering an empty heart first
// and then flipping it would cause a visible flash and a hydration mismatch.

import { useState } from "react";
import { useWishlist } from "../lib/wishlist.js";
import { trackAddToWishlist } from "../lib/analytics.js";

export default function WishlistButton({
  product,
  className = "",
  size = "md",
  withLabel = false,
}) {
  const { has, toggle, ready } = useWishlist();
  const [pulse, setPulse] = useState(false);

  const saved = ready && has(product.slug);
  const box = size === "lg" ? "h-11 w-11" : "h-9 w-9";
  const icon = size === "lg" ? "h-6 w-6" : "h-5 w-5";

  function onClick(e) {
    // Cards wrap the whole tile in a <Link>. Without this, saving navigates.
    e.preventDefault();
    e.stopPropagation();

    const added = toggle(product);
    if (added) {
      trackAddToWishlist(product);
      setPulse(true);
      setTimeout(() => setPulse(false), 350);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? "إزالة من المفضلة" : "أضف إلى المفضلة"}
      title={saved ? "إزالة من المفضلة" : "أضف إلى المفضلة"}
      className={`inline-flex items-center justify-center gap-2 rounded-full border transition-all duration-200 ${
        withLabel ? "px-4 py-2.5" : box
      } ${
        saved
          ? "border-coral/40 bg-coral/10 text-coral"
          : "border-line bg-cream/90 text-ink/45 hover:border-coral/40 hover:text-coral"
      } ${pulse ? "scale-125" : "hover:scale-105"} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`${icon} transition-transform duration-200`}
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.8-7.7 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z" />
      </svg>
      {withLabel && (
        <span className="text-sm font-medium">
          {saved ? "في المفضلة" : "أضف إلى المفضلة"}
        </span>
      )}
    </button>
  );
}
