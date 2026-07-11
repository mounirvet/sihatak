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
    icon: "spark",
  },
  {
    slug: "electric-brushes",
    title_ar: "الفرش الكهربائية",
    blurb_ar: "فرش أسنان كهربائية ورؤوس بديلة لتنظيف أعمق.",
    icon: "brush",
  },
  {
    slug: "interdental-care",
    title_ar: "تنظيف ما بين الأسنان",
    blurb_ar: "خيوط وفرش بينية وأجهزة الماء لتنظيف المناطق التي تصعب على الفرشاة.",
    icon: "drop",
  },
  {
    slug: "aligner-care",
    title_ar: "العناية بالتقويم الشفاف",
    blurb_ar: "منظّفات وحافظات وأدوات العناية بالتقويم الشفاف والمثبتات.",
    icon: "gem",
  },
  {
    slug: "kids",
    title_ar: "أسنان الأطفال",
    blurb_ar: "فرش ومنتجات عناية آمنة ومناسبة لأعمار الأطفال.",
    icon: "balloon",
  },
  {
    slug: "gum-care",
    title_ar: "العناية باللثة",
    blurb_ar: "منتجات مخصصة لدعم صحة اللثة والعناية بها.",
    icon: "leaf",
  },
  {
    slug: "fresh-breath",
    title_ar: "انتعاش النفس",
    blurb_ar: "منظّفات اللسان وغسولات ومنتجات للحفاظ على نفس منتعش.",
    icon: "wind",
  },
  {
    slug: "accessories",
    title_ar: "أدوات وملحقات",
    blurb_ar: "حافظات، أغطية، وأدوات مساعدة للعناية اليومية بالأسنان.",
    icon: "target",
  },
  {
    slug: "toothpaste",
    title_ar: "معاجين الأسنان",
    blurb_ar: "معاجين وأقراص تنظيف للعناية اليومية، بتركيبات متنوعة للتبييض والحماية.",
    icon: "tooth",
  },
  {
    slug: "mouthwash",
    title_ar: "غسول الفم",
    blurb_ar: "غسولات ورذاذ للفم لانتعاش النفس ودعم نظافة الفم اليومية.",
    icon: "wave",
  },
  {
    slug: "denture-care",
    title_ar: "العناية بالأطقم والتركيبات",
    blurb_ar: "منتجات مساعدة للعناية بأطقم الأسنان والتركيبات المؤقتة. استشر طبيب الأسنان دائمًا.",
    icon: "hands",
  },
];

// Promo/offer banner cards for the shop home carousel — brand-neutral, no fake
// urgency. Each links to a category or the full shop. `code` is optional.
export const SHOP_PROMOS = [
  {
    title_ar: "عناية متكاملة",
    subtitle_ar: "كل ما تحتاجه لابتسامة صحية في مكان واحد",
    cta_ar: "تسوّق الآن",
    href: "/shop/",
    theme: "teal",
  },
  {
    title_ar: "شحن إلى دول الخليج",
    subtitle_ar: "توصيل موثوق ودفع آمن عبر Stripe",
    cta_ar: "اكتشف المزيد",
    href: "/shop/al-shahn/",
    theme: "mint",
  },
  {
    title_ar: "ابتسامة أنصع",
    subtitle_ar: "منتجات التبييض المنزلي المختارة",
    cta_ar: "تسوّق التبييض",
    href: "/shop/whitening/",
    theme: "coral",
  },
];

export function getCategoryBySlug(slug) {
  return STORE_CATEGORIES.find((c) => c.slug === slug) || null;
}

export function allCategorySlugs() {
  return STORE_CATEGORIES.map((c) => c.slug);
}

// Editorial pillar -> shop category mapping. Powers brand-neutral article-to-shop
// cross-links. Articles link to a CATEGORY, never a branded product (YMYL wall).
// A pillar may map to more than one relevant category; the first is primary.
export const PILLAR_TO_CATEGORIES = {
  "tabyid-al-asnan": ["whitening"],
  "al-inaya-al-yawmiyya": ["electric-brushes", "interdental-care"],
  "amrad-al-litha": ["gum-care", "interdental-care"],
  "asnan-al-atfal": ["kids"],
  "taqwim-al-asnan": ["aligner-care"],
  "taghdiya-wa-sihhat-al-fam": ["fresh-breath"],
  // Pillars with no natural product category (ziraat-al-asnan, tasawwus-al-asnan)
  // deliberately omitted — no shop CTA shown, keeping links relevant only.
};

export function getCategoriesForPillar(pillarSlug) {
  const slugs = PILLAR_TO_CATEGORIES[pillarSlug] || [];
  return slugs.map((s) => getCategoryBySlug(s)).filter(Boolean);
}
