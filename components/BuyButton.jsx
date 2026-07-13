"use client";
// components/BuyButton.jsx — Snipcart CTAs.
//
// Renders TWO actions, because they serve different shoppers:
//
//   • "اشترِ الآن"     — adds the item AND opens checkout immediately. This is
//                        the primary path: most orders are a single product,
//                        and forcing add → find cart → checkout costs
//                        conversions for no benefit.
//   • "أضف إلى السلة"  — adds and stays on the page, for someone assembling a
//                        multi-item order.
//
// Stripe is still the processor; Snipcart is only the cart + checkout UI, and
// it runs on asnanik.com so a real `Purchase` event can fire.
//
// ── SNIPCART VALIDATION (fails SILENTLY) ────────────────────────────────────
// Snipcart crawls `data-item-url` and re-reads the price to confirm the button
// isn't lying. So:
//   • data-item-price MUST be a bare number ("349"), never "349 ر.س"
//   • data-item-url / data-item-image MUST be absolute
// A mismatch throws nothing — it just refuses the order.

import { useState } from "react";
import { IcCart, IcArrowLeft } from "./ShopIcons.js";
import { trackAddToCart } from "../lib/analytics.js";

// Shared Snipcart data attributes so both buttons describe the same product.
function itemAttrs(product) {
  return {
    "data-item-id": product.slug,
    "data-item-name": product.title_ar,
    "data-item-price": product.price,
    "data-item-url": product.url,
    "data-item-image": product.imageAbs || undefined,
    "data-item-description": product.short_desc || undefined,
    "data-item-max-quantity": 10,
  };
}

export default function BuyButton({
  product,
  price,
  currency,
  buyable,
  inStock,
  big = false,
  block = false,
  className = "",
  label,
  showAddToCart = true, // sticky mobile bar sets this false — no room for two
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

  const attrs = itemAttrs(product);

  // Buy now: let Snipcart's own click handler add the item, then open the cart
  // on the next tick so the item is already in it.
  function onBuyNow() {
    trackAddToCart(product);
    setTimeout(() => {
      window.Snipcart?.api?.theme?.cart?.open?.();
    }, 300);
  }

  return (
    <div className={`flex flex-col gap-2.5 ${block ? "w-full" : ""} ${className}`}>
      {/* PRIMARY — buy now */}
      <button
        type="button"
        {...attrs}
        onClick={onBuyNow}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        className={`snipcart-add-item group relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-coral text-center font-bold text-white shadow-[0_10px_30px_-10px_rgba(224,120,86,0.7)] transition-all duration-200 hover:shadow-[0_16px_40px_-10px_rgba(224,120,86,0.85)] ${
          big ? "px-8 py-5 text-lg" : "px-6 py-4"
        } ${block ? "w-full" : ""} ${pressed ? "scale-[0.97]" : "hover:scale-[1.02]"}`}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-l from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        <span className="relative">
          {label || "اشترِ الآن"} — {price} {currency}
        </span>
        <IcArrowLeft className="relative h-5 w-5 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-translate-x-1" />
      </button>

      {/* SECONDARY — add to cart, stay on the page */}
      {showAddToCart && (
        <button
          type="button"
          {...attrs}
          onClick={() => trackAddToCart(product)}
          className={`snipcart-add-item group flex items-center justify-center gap-2 rounded-2xl border-2 border-teal/25 bg-transparent font-medium text-teal-dark transition-all duration-200 hover:border-teal hover:bg-mint/30 ${
            big ? "px-8 py-3.5" : "px-6 py-3"
          } ${block ? "w-full" : ""}`}
        >
          <IcCart className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>أضف إلى السلة</span>
        </button>
      )}
    </div>
  );
}
