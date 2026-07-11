"use client";
// components/BuyButton.jsx — innovative, interactive CTA.
// - animated sheen sweep on hover
// - satisfying press (scale) feedback
// - cart icon that nudges on hover
// - disabled state for unbuyable products
// Pure CSS/JS, static-export safe. No emojis.

import { useState } from "react";
import { IcCart, IcArrowLeft } from "./ShopIcons.js";

export default function BuyButton({
  href,
  price,
  currency,
  buyable,
  inStock,
  big = false,
  block = false,
  className = "",
  label,
}) {
  const [pressed, setPressed] = useState(false);

  if (!buyable) {
    return (
      <button
        disabled
        className={`flex items-center justify-center gap-2 rounded-2xl bg-ink/10 px-6 py-4 text-center font-medium text-ink/45 ${block ? "w-full" : ""} ${className}`}
      >
        {inStock ? "غير متاح حاليًا" : "نفدت الكمية"}
      </button>
    );
  }

  return (
    <a
      href={href}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      className={`group relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-coral text-center font-bold text-white shadow-[0_10px_30px_-10px_rgba(224,120,86,0.7)] transition-all duration-200 hover:shadow-[0_16px_40px_-10px_rgba(224,120,86,0.85)] ${
        big ? "px-8 py-5 text-lg" : "px-6 py-4"
      } ${block ? "w-full" : ""} ${pressed ? "scale-[0.97]" : "hover:scale-[1.02]"} ${className}`}
    >
      {/* animated sheen sweep */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-l from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      <IcCart className="relative h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
      <span className="relative">
        {label || "اطلبها الآن"} — {price} {currency}
      </span>
      <IcArrowLeft className="relative h-5 w-5 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-translate-x-1" />
    </a>
  );
}
