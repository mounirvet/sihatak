"use client";
// components/BundleSelector.jsx — modern quantity/bundle picker.
//
// Row-card layout (the pattern top DTC brands use): each bundle is a full-width
// selectable row with a radio, label, per-unit economics, a live savings pill,
// and an optional "most popular" ribbon. Selecting one drives the BuyButton
// price + a distinct Snipcart line item (id suffixed -x2 / -x3 so bundles don't
// merge and each price validates independently).
//
// Reads `bundles` from frontmatter: [{qty, price, label, badge?, best?}].
// Rendered only when bundles.length > 1; otherwise the page uses BuyButton.

import { useState } from "react";
import BuyButton from "./BuyButton.jsx";

export default function BundleSelector({ product, bundles, currency, buyable }) {
  const defaultIdx = Math.max(0, bundles.findIndex((b) => b.best));
  const [idx, setIdx] = useState(defaultIdx === -1 ? 0 : defaultIdx);
  const sel = bundles[idx];

  const single = bundles.find((b) => b.qty === 1)?.price || bundles[0].price;
  const saved = single * sel.qty - sel.price;
  const pct = Math.round((saved / (single * sel.qty)) * 100);

  const bundleProduct = {
    ...product,
    slug: sel.qty === 1 ? product.slug : `${product.slug}-x${sel.qty}`,
    title_ar:
      sel.qty === 1 ? product.title_ar : `${product.title_ar} (${sel.label})`,
    price: sel.price,
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-bold text-ink">اختر الكمية ووفّر أكثر</span>
        <span className="text-xs text-ink/45">الشحن يُحتسب مرة واحدة</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {bundles.map((b, i) => {
          const active = i === idx;
          const perUnit = Math.round(b.price / b.qty);
          const bSaved = single * b.qty - b.price;
          const bPct = Math.round((bSaved / (single * b.qty)) * 100);
          return (
            <button
              key={b.qty}
              type="button"
              onClick={() => setIdx(i)}
              aria-pressed={active}
              className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border-2 px-4 py-3.5 text-right transition-all duration-200 ${
                active
                  ? "border-teal bg-mint/25 shadow-[0_10px_30px_-12px_rgba(14,92,99,0.55)]"
                  : "border-line bg-cream hover:border-teal/45 hover:bg-mint/10"
              }`}
            >
              {b.best && (
                <span className="pointer-events-none absolute left-0 top-0 rounded-br-xl rounded-tl-[14px] bg-coral px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
                  الأكثر طلبًا
                </span>
              )}

              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  active ? "border-teal bg-teal" : "border-ink/25 bg-transparent"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full bg-white transition-opacity ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
              </span>

              <span className="flex flex-1 flex-col">
                <span className="flex items-center gap-2">
                  <span className="font-display text-base font-bold text-ink">
                    {b.label}
                  </span>
                  {bPct > 0 && (
                    <span className="rounded-full bg-coral/10 px-2 py-0.5 text-[11px] font-bold text-coral">
                      خصم {bPct}%
                    </span>
                  )}
                </span>
                {b.qty > 1 ? (
                  <span className="mt-0.5 text-xs text-ink/55">
                    {perUnit} {currency} للعبوة
                    <span className="mr-1.5 text-ink/35 line-through">
                      {single} {currency}
                    </span>
                  </span>
                ) : (
                  <span className="mt-0.5 text-xs text-ink/45">السعر القياسي</span>
                )}
              </span>

              <span className="flex shrink-0 flex-col items-end">
                <span className="font-display text-lg font-extrabold text-teal-dark">
                  {b.price} {currency}
                </span>
                {bSaved > 0 && (
                  <span className="text-[11px] font-semibold text-coral">
                    وفّر {bSaved} {currency}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {saved > 0 && (
        <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-teal-dark px-4 py-2.5 text-sm font-bold text-cream">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-coral" fill="currentColor" aria-hidden="true">
            <path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2L12 16.6 5.7 21l2.3-7.2-6-4.4h7.6z" />
          </svg>
          توفّر {saved} {currency} ({pct}%) مع {sel.label}
        </div>
      )}

      <div className="mt-4">
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

      <p className="mt-2.5 text-center text-xs text-ink/50">
        الكمية الأكبر = سعر أقل للعبوة · شحن واحد لكل الطلب
      </p>
    </div>
  );
}
