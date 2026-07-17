"use client";
// components/BundleSelector.jsx — quantity/bundle picker that drives the
// BuyButton price + Snipcart line item.
//
// Reads `bundles` from the product frontmatter (array of {qty, price, label,
// badge?, best?}). Selecting a bundle changes:
//   • the displayed price
//   • the per-unit hint
//   • the Snipcart data-item-id (each bundle is a DISTINCT line item, so its
//     price validates independently) and data-item-price
//
// If a product has no `bundles`, the page falls back to the plain BuyButton —
// this component is only rendered when bundles.length > 1.

import { useState } from "react";
import BuyButton from "./BuyButton.jsx";

export default function BundleSelector({ product, bundles, currency, buyable }) {
  // default to the "best" bundle if flagged, else the first
  const defaultIdx = Math.max(0, bundles.findIndex((b) => b.best));
  const [idx, setIdx] = useState(defaultIdx === -1 ? 0 : defaultIdx);
  const sel = bundles[idx];

  const perUnit = Math.round(sel.price / sel.qty);
  const single = bundles.find((b) => b.qty === 1)?.price || bundles[0].price;
  const saved = single * sel.qty - sel.price;

  // Build a per-bundle product object so Snipcart sees a distinct line item
  // with the right id + price. The id suffix keeps bundles from merging.
  const bundleProduct = {
    ...product,
    slug: sel.qty === 1 ? product.slug : `${product.slug}-x${sel.qty}`,
    title_ar:
      sel.qty === 1 ? product.title_ar : `${product.title_ar} (${sel.label})`,
    price: sel.price,
  };

  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {bundles.map((b, i) => {
          const active = i === idx;
          const pu = Math.round(b.price / b.qty);
          return (
            <button
              key={b.qty}
              type="button"
              onClick={() => setIdx(i)}
              className={`relative flex flex-col items-center rounded-xl border-2 p-3 text-center transition-all ${
                active
                  ? "border-teal bg-mint/30 shadow-[0_6px_20px_-8px_rgba(14,92,99,0.5)]"
                  : "border-line bg-cream hover:border-teal/40"
              }`}
            >
              {b.badge && (
                <span
                  className={`absolute -top-2 right-1/2 translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    b.best ? "bg-coral text-white" : "bg-teal-dark text-cream"
                  }`}
                >
                  {b.badge}
                </span>
              )}
              <span className="mt-1 font-display text-base font-bold text-ink">
                {b.label}
              </span>
              <span className="mt-1 font-display text-lg font-bold text-teal-dark">
                {b.price} {currency}
              </span>
              {b.qty > 1 && (
                <span className="text-[11px] text-ink/50">
                  {pu} {currency}/عبوة
                </span>
              )}
            </button>
          );
        })}
      </div>

      {saved > 0 && (
        <p className="mb-3 text-sm font-medium text-coral">
          توفّر {saved} {currency} مع {sel.label}
        </p>
      )}

      <BuyButton
        product={bundleProduct}
        price={sel.price}
        currency={currency}
        buyable={buyable}
        inStock={product.in_stock}
        big
        block
      />
    </div>
  );
}
