"use client";
// components/BuyButton.jsx — Snipcart add-to-cart CTA.
//
// WAS: an <a href> to a Stripe Payment Link — checkout happened on
// buy.stripe.com, a domain we don't own. That meant no `Purchase` event could
// ever fire, so Meta/Google could never learn who bought and could not optimise
// ad spend on conversions.
//
// NOW: a Snipcart button. The cart and checkout live on asnanik.com. Stripe is
// STILL the processor — Snipcart settles through the same Stripe account. We
// only replaced the cart/checkout UI, not the payments.
//
// ── SNIPCART VALIDATION (fails SILENTLY if you get this wrong) ───────────────
// On add-to-cart, Snipcart fetches `data-item-url` and re-reads the product's
// price from that page to confirm the button isn't lying. Therefore:
//   • data-item-price MUST be a bare number ("349"), never "349 ر.س"
//   • data-item-url    MUST be absolute and publicly crawlable
//   • data-item-id     MUST be stable + unique (we use the slug)
//   • data-item-image  MUST be absolute (Snipcart can't resolve "/images/...")
// A mismatch doesn't throw — it just refuses the order.

import { useState } from "react";
import { IcCart, IcArrowLeft } from "./ShopIcons.js";
import { trackAddToCart } from "../lib/analytics.js";

export default function BuyButton({
  product,          // { slug, title_ar, category, price, image, ... }
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
    <button
      type="button"
      className={`snipcart-add-item group relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-coral text-center font-bold text-white shadow-[0_10px_30px_-10px_rgba(224,120,86,0.7)] transition-all duration-200 hover:shadow-[0_16px_40px_-10px_rgba(224,120,86,0.85)] ${
        big ? "px-8 py-5 text-lg" : "px-6 py-4"
      } ${block ? "w-full" : ""} ${pressed ? "scale-[0.97]" : "hover:scale-[1.02]"} ${className}`}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={() => trackAddToCart(product)}
      data-item-id={product.slug}
      data-item-name={product.title_ar}
      data-item-price={product.price}
      data-item-url={product.url}
      data-item-image={product.imageAbs || undefined}
      data-item-description={product.short_desc || undefined}
      data-item-max-quantity={10}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-l from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      <IcCart className="relative h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
      <span className="relative">
        {label || "أضف إلى السلة"} — {price} {currency}
      </span>
      <IcArrowLeft className="relative h-5 w-5 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-translate-x-1" />
    </button>
  );
}
