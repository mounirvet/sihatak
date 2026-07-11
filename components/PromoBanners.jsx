// components/PromoBanners.jsx — noon-style offer banners (ticket cards) that
// scroll horizontally. Brand-neutral, no fake urgency. Server component.

import Link from "next/link";
import { IcChevron } from "./ShopIcons.js";

const THEME = {
  teal: "from-teal to-teal-dark text-cream",
  mint: "from-mint to-[#bfe0dc] text-teal-dark",
  coral: "from-coral to-[#c85f40] text-white",
};

export default function PromoBanners({ promos = [] }) {
  if (!promos.length) return null;
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {promos.map((promo, i) => (
        <Link
          key={i}
          href={promo.href || "/shop/"}
          className={`relative flex min-h-[150px] w-[85%] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br p-6 shadow-card transition hover:brightness-[1.03] sm:w-[46%] lg:w-[32%] ${
            THEME[promo.theme] || THEME.teal
          }`}
        >
          <div>
            <h3 className="font-display text-xl font-bold leading-tight">{promo.title_ar}</h3>
            <p className="mt-1.5 text-sm opacity-90">{promo.subtitle_ar}</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-sm font-bold">
              {promo.cta_ar}
              <IcChevron className="h-4 w-4 rotate-90" />
            </span>
            {promo.code && (
              <span className="rounded-lg bg-black/20 px-2.5 py-1 text-xs font-bold tracking-wide">
                {promo.code}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
