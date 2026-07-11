// lib/storeCategories.js
// COMMERCIAL taxonomy for the /shop/ section — intentionally separate from the
// editorial content pillars in the /maqalat/ authority section.
// Editorial = "what problem / why". Commercial = "what you buy to solve it".
//
// slug: clean ASCII, used in URLs -> /shop/[slug]/
// title_ar: RTL display name
// blurb_ar: one-line category intro (answer-first friendly, brand-neutral)
// Adjust freely — this is a proposal, not locked.

export const STORE_CATEGORIES = [
  {
    slug: "whitening",
    title_ar: "منتجات التبييض",
    blurb_ar: "أطقم ولصقات وأقلام تبييض الأسنان للاستخدام المنزلي.",
  },
  {
    slug: "electric-brushes",
    title_ar: "الفرش الكهربائية",
    blurb_ar: "فرش أسنان كهربائية ورؤوس بديلة لتنظيف أعمق.",
  },
  {
    slug: "interdental-care",
    title_ar: "تنظيف ما بين الأسنان",
    blurb_ar: "خيوط وفرش بينية وأجهزة الماء لتنظيف المناطق التي تصعب على الفرشاة.",
  },
  {
    slug: "aligner-care",
    title_ar: "العناية بالتقويم الشفاف",
    blurb_ar: "منظّفات وحافظات وأدوات العناية بالتقويم الشفاف والمثبتات.",
  },
  {
    slug: "kids",
    title_ar: "أسنان الأطفال",
    blurb_ar: "فرش ومنتجات عناية آمنة ومناسبة لأعمار الأطفال.",
  },
  {
    slug: "gum-care",
    title_ar: "العناية باللثة",
    blurb_ar: "منتجات مخصصة لدعم صحة اللثة والعناية بها.",
  },
  {
    slug: "fresh-breath",
    title_ar: "انتعاش النفس",
    blurb_ar: "منظّفات اللسان وغسولات ومنتجات للحفاظ على نفس منتعش.",
  },
  {
    slug: "accessories",
    title_ar: "أدوات وملحقات",
    blurb_ar: "حافظات، أغطية، وأدوات مساعدة للعناية اليومية بالأسنان.",
  },
];

export function getCategoryBySlug(slug) {
  return STORE_CATEGORIES.find((c) => c.slug === slug) || null;
}

export function allCategorySlugs() {
  return STORE_CATEGORIES.map((c) => c.slug);
}
