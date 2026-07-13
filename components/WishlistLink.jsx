"use client";
// components/WishlistLink.jsx — heart + live count for the site header.
//
// Renders the icon immediately but the badge only once localStorage has been
// read, so there's no hydration mismatch and no "0" flashing to a visitor who
// actually has items saved.

import Link from "next/link";
import { useWishlist } from "../lib/wishlist.js";

export default function WishlistLink({ className = "" }) {
  const { count, ready } = useWishlist();

  return (
    <Link
      href="/shop/al-mufaddala/"
      aria-label={count > 0 ? `المفضلة — ${count} منتج` : "المفضلة"}
      title="المفضلة"
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition hover:bg-mint/40 hover:text-coral ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill={ready && count > 0 ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.8-7.7 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z" />
      </svg>

      {ready && count > 0 && (
        <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold leading-none text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
