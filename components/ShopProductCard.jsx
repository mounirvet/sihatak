// components/ShopProductCard.jsx — noon-inspired product card (brand-neutral).
// Star display + price + strikethrough compare price + bold green discount %,
// discount badge, honest "عرض محدود" ribbon when flagged. No fabricated review
// counts, no fake countdowns. Server component (pure), static-export safe.

import Link from "next/link";
import { ShopIcon } from "./ShopIcons.js";
import { SHOP_CURRENCY_SYMBOL_AR } from "../lib/products.js";
import { imageAlt } from "../lib/imageSeo.js";
import WishlistButton from "./WishlistButton.jsx";

export default function ShopProductCard({ p, limited = false, className = "" }) {
  const currency = SHOP_CURRENCY_SYMBOL_AR;
  const savePct =
    p.compare_at_price && p.compare_at_price > p.price
      ? Math.round((1 - p.price / p.compare_at_price) * 100)
      : 0;

  const productLite = {
    slug: p.slug,
    title_ar: p.title_ar,
    category: p.category,
    price: p.price,
    compare_at_price: p.compare_at_price ?? null,
    image: p.images?.[0] || null,
  };

  return (
    <div className={`relative ${className}`}>
    <div className="absolute right-3 top-3 z-20">
      <WishlistButton product={productLite} />
    </div>
    <Link
      href={`/shop/${p.category}/${p.slug}/`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-cream transition hover:-translate-y-1 hover:border-teal hover:shadow-card"
    >
      {limited && (
        <span className="absolute right-0 top-3 z-10 rounded-l-full bg-teal-dark px-3 py-1 text-[11px] font-bold text-cream shadow">
          عرض محدود
        </span>
      )}
      {savePct > 0 && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-coral px-2 py-0.5 text-xs font-bold text-white shadow">
          -{savePct}٪
        </span>
      )}

      <div className="flex aspect-square items-center justify-center overflow-hidden bg-white">
        {p.images && p.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.images[0]}
            alt={imageAlt(p, 0)}
            width={1200}
            height={1200}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105"
          />
        ) : (
          <ShopIcon name="tooth" className="h-12 w-12 text-teal/25" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-ink">
          {p.title_ar}
        </h3>

        {/* No rating shown. We have no review data, and five filled stars read
            as "rated 5/5" whether or not a count sits beside them — that's a
            fabricated trust signal, which this site does not ship. If real
            reviews are ever collected, render them from that data. */}

        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-2">
          <span className="font-display text-lg font-bold text-teal-dark">
            {p.price} {currency}
          </span>
          {p.compare_at_price ? (
            <span className="text-xs text-ink/40 line-through">
              {p.compare_at_price}
            </span>
          ) : null}
          {savePct > 0 ? (
            <span className="text-xs font-bold text-green-600">{savePct}%</span>
          ) : null}
        </div>
      </div>
    </Link>
    </div>
  );
}
