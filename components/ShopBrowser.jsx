"use client";
// components/ShopBrowser.jsx — client-side search / sort / filter over the catalog.
//
// WHY A CLIENT COMPONENT:
// The site is a static export, so there is no server to query at request time.
// Instead the parent SERVER page passes the already-loaded catalog down as plain
// JSON (see `products` prop) and all filtering happens in the browser. 32 products
// is tiny — the whole catalog is a few KB — so this costs nothing and gives instant,
// zero-latency filtering with no network round-trip.
//
// ShopProductCard is a server component (it imports fs-backed helpers), so it can't
// be rendered from here. This component renders its own card markup, kept visually
// identical to ShopProductCard.
//
// No fabricated urgency, no fake review counts. Honest data only.

import { useState, useMemo } from "react";
import Link from "next/link";
import WishlistButton from "./WishlistButton.jsx";
import { trackSearch } from "../lib/analytics.js";

const CURRENCY = "ر.س";

// Arabic search is fussy: users type "تبييض" but content may have "تَبْيِيض",
// and أ/إ/آ vs ا is a coin flip. Normalise both sides so search actually works.
function normalizeAr(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0670]/g, "") // strip harakat (diacritics)
    .replace(/[\u0622\u0623\u0625]/g, "\u0627") // آ أ إ -> ا
    .replace(/\u0649/g, "\u064A") // ى -> ي
    .replace(/\u0629/g, "\u0647") // ة -> ه
    .replace(/[\u0640]/g, "") // tatweel
    .trim();
}

function discountPct(p) {
  return p.compare_at_price && p.compare_at_price > p.price
    ? Math.round((1 - p.price / p.compare_at_price) * 100)
    : 0;
}

const SORTS = [
  { key: "featured", label: "الأكثر صلة" },
  { key: "price_asc", label: "السعر: من الأقل" },
  { key: "price_desc", label: "السعر: من الأعلى" },
  { key: "discount", label: "أكبر خصم" },
];

export default function ShopBrowser({
  products = [],
  categories = [],
  showCategoryFilter = true,
}) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured");
  const [cat, setCat] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);

  const results = useMemo(() => {
    const nq = normalizeAr(q);
    let out = products;

    if (cat !== "all") out = out.filter((p) => p.category === cat);
    if (inStockOnly) out = out.filter((p) => p.in_stock);

    if (nq) {
      out = out.filter((p) => {
        const haystack = normalizeAr(
          [p.title_ar, p.short_desc, p.category_title, p.slug].join(" ")
        );
        // every typed word must appear somewhere — narrows as you type
        return nq.split(/\s+/).every((w) => haystack.includes(w));
      });
    }

    const sorted = [...out];
    if (sort === "price_asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "discount")
      sorted.sort((a, b) => discountPct(b) - discountPct(a));
    else
      // "featured": photographed products first, then in-stock, then bigger discount
      sorted.sort(
        (a, b) =>
          (b.has_image === true) - (a.has_image === true) ||
          (b.in_stock === true) - (a.in_stock === true) ||
          discountPct(b) - discountPct(a)
      );

    return sorted;
  }, [products, q, sort, cat, inStockOnly]);

  const active = q || cat !== "all" || inStockOnly;

  return (
    <div dir="rtl">
      {/* CONTROLS */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن منتج… مثل: تبييض، خيط مائي، فرشاة"
            aria-label="ابحث في المتجر"
            className="w-full rounded-2xl border border-line bg-cream px-4 py-3 pe-11 text-ink outline-none transition placeholder:text-ink/40 focus:border-teal focus:ring-2 focus:ring-teal/20"
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute end-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/35"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="ترتيب النتائج"
          className="rounded-2xl border border-line bg-cream px-4 py-3 text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
        >
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>

        {showCategoryFilter && categories.length > 0 && (
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            aria-label="تصفية حسب الفئة"
            className="rounded-2xl border border-line bg-cream px-4 py-3 text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
          >
            <option value="all">كل الفئات</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title_ar}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* SECONDARY FILTERS + COUNT */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <label className="inline-flex cursor-pointer select-none items-center gap-2 text-ink/70">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-4 w-4 rounded border-line accent-teal"
          />
          المتوفّر فقط
        </label>

        <span className="text-ink/50">
          {results.length} من {products.length} منتج
        </span>

        {active && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setCat("all");
              setInStockOnly(false);
            }}
            className="text-teal underline underline-offset-2 hover:text-teal-dark"
          >
            مسح التصفية
          </button>
        )}
      </div>

      {/* RESULTS */}
      {results.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-line bg-sand/40 px-4 py-8 text-center text-ink/60">
          لا توجد منتجات مطابقة. جرّب كلمة أخرى أو امسح التصفية.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <BrowserCard key={p.slug} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}

// Visual twin of ShopProductCard. Kept local because ShopProductCard is a
// server component and cannot be imported into a client boundary.
function BrowserCard({ p }) {
  const save = discountPct(p);

  return (
    <div className="relative">
    <div className="absolute right-3 top-3 z-20">
      <WishlistButton product={p} />
    </div>
    <Link
      href={`/shop/${p.category}/${p.slug}/`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-cream transition hover:-translate-y-1 hover:border-teal hover:shadow-card"
    >
      {save > 0 && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-coral px-2 py-0.5 text-xs font-bold text-white shadow">
          -{save}٪
        </span>
      )}

      <div className="flex aspect-square items-center justify-center overflow-hidden bg-white">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image}
            alt={p.title_ar}
            width={1200}
            height={1200}
            loading="lazy"
            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-ink/20">
            <svg viewBox="0 0 24 24" className="h-12 w-12" fill="currentColor">
              <path d="M12 2C8 2 6 5 6 9c0 5 2 13 4 13s2-4 2-4 0 4 2 4 4-8 4-13c0-4-2-7-6-7Z" />
            </svg>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-ink group-hover:text-teal">
          {p.title_ar}
        </h3>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg text-teal-dark">
              {p.price} {CURRENCY}
            </span>
            {save > 0 && (
              <span className="text-xs text-ink/40 line-through">
                {p.compare_at_price}
              </span>
            )}
          </div>
          {!p.in_stock && (
            <span className="mt-1 inline-block text-xs text-ink/45">
              نفدت الكمية
            </span>
          )}
        </div>
      </div>
    </Link>
    </div>
  );
}
