// components/InTheBox.jsx — "ما الذي ستحصل عليه" (what's in the package).
// Row layout inspired by premium product pages: icon + accent quantity + item name.
// Brand palette (teal/mint/coral), premium SVG icons, zero emojis.
// Server component (pure) — static-export safe.

import { ShopIcon, IcBox } from "./ShopIcons.js";

export default function InTheBox({ items = [] }) {
  if (!items.length) return null;

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="font-display text-2xl font-bold text-ink">
          ماذا يتضمّن <span className="text-teal">الصندوق؟</span>
        </h2>
        <p className="mt-2 text-sm text-ink/60">كل ما ستجده داخل العبوة.</p>
      </div>

      <ul className="mx-auto max-w-2xl space-y-3">
        {items.map((it, i) => (
          <li
            key={i}
            className="group flex items-center gap-4 rounded-2xl border border-line bg-cream px-5 py-4 transition hover:border-teal hover:shadow-card"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mint/50 text-teal-dark transition group-hover:bg-teal group-hover:text-cream">
              <ShopIcon name={it.icon || "box"} className="h-6 w-6" />
            </span>

            <span className="flex flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-display text-base font-bold text-coral">
                {it.qty}×
              </span>
              <span className="text-[15px] font-medium leading-snug text-ink">
                {it.item}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-ink/50">
        <IcBox className="h-4 w-4" />
        قد تختلف بعض المحتويات بحسب الطراز أو العبوة المتوفرة.
      </p>
    </div>
  );
}
