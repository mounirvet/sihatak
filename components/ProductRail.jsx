// components/ProductRail.jsx — a named, horizontally-scrolling product rail.
// Header row: title (+ optional accent) and a "عرض الكل" link. Cards scroll
// horizontally on all screens (noon-style), snapping for a clean feel.
// Server component (pure) — static-export safe.

import Link from "next/link";
import ShopProductCard from "./ShopProductCard.jsx";
import { IcChevron } from "./ShopIcons.js";

export default function ProductRail({
  title,
  products = [],
  viewAllHref,
  limited = false,
  band = false, // colored background band (used for the "عرض محدود" rail)
}) {
  if (!products.length) return null;

  return (
    <section
      className={
        band
          ? "mt-12 rounded-3xl bg-mint/40 px-4 py-8 md:px-6"
          : "mt-12"
      }
    >
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-xl text-teal-dark md:text-2xl">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-teal hover:underline"
          >
            عرض الكل
            <IcChevron className="h-4 w-4 rotate-90" />
          </Link>
        )}
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <div key={p.slug} className="w-40 shrink-0 snap-start sm:w-48">
            <ShopProductCard p={p} limited={limited} />
          </div>
        ))}
      </div>
    </section>
  );
}
