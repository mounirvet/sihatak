// lib/imageSeo.js
// Image SEO for the shop.
//
// Problem this solves: every product image previously shared ONE alt text
// (the product title). Google treats near-duplicate alts as low-value and it
// wastes the ranking opportunity of images 2..5 in Google Images.
//
// This generates a UNIQUE, descriptive, Arabic alt per image slot, derived from
// the product's real data (title, brand, category) — no keyword stuffing, just
// an honest description of what each shot actually shows.

import { getCategoryBySlug } from "./storeCategories.js";

// What each image slot conventionally shows in our shoots.
// Position-aware so alt #1 != alt #5.
const SLOT_INTENT = {
  1: (p, cat) => `${p.title_ar} — صورة المنتج وعبوته`,
  2: (p, cat) => `${p.title_ar} — الاستخدام اليومي ضمن روتين ${cat}`,
  3: (p, cat) => `${p.title_ar} — خطوات الاستخدام الصحيحة`,
  4: (p, cat) => `${p.title_ar} — مقارنة المزايا والمواصفات`,
  5: (p, cat) => `${p.title_ar} — النتيجة والتفاصيل عن قرب`,
};

const CATEGORY_NOUN = {
  whitening: "تبييض الأسنان",
  "electric-brushes": "تنظيف الأسنان",
  "interdental-care": "تنظيف ما بين الأسنان",
  "aligner-care": "العناية بالتقويم الشفاف",
  kids: "عناية أسنان الأطفال",
  "gum-care": "العناية باللثة",
  "fresh-breath": "انتعاش النفس",
  accessories: "العناية بالأسنان",
  toothpaste: "العناية اليومية بالأسنان",
  mouthwash: "العناية بالفم",
  "denture-care": "العناية بأطقم الأسنان",
};

/**
 * Unique alt text for image at `index` (0-based) of product `p`.
 * Falls back gracefully past slot 5.
 */
export function imageAlt(p, index = 0) {
  const slot = index + 1;
  const cat = CATEGORY_NOUN[p.category] || "العناية بالأسنان";
  const fn = SLOT_INTENT[slot];
  if (fn) return fn(p, cat);
  return `${p.title_ar} — صورة ${slot}`;
}

/** Absolute URL for schema/OG (relative paths break rich results + share cards). */
export function absImage(src, siteUrl) {
  if (!src) return null;
  return src.startsWith("http") ? src : `${siteUrl}${src}`;
}

/**
 * Rich ImageObject array for Product JSON-LD.
 * Google prefers ImageObject with caption over a bare URL list.
 */
export function imageObjects(p, siteUrl) {
  return (p.images || []).map((src, i) => ({
    "@type": "ImageObject",
    url: absImage(src, siteUrl),
    caption: imageAlt(p, i),
    contentUrl: absImage(src, siteUrl),
    representativeOfPage: i === 0,
  }));
}
