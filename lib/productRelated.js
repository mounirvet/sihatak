// lib/productRelated.js
// Recommends OTHER PRODUCTS for a product page:
//   - relatedProducts:  same category (the obvious "more like this")
//   - similarProducts:  cross-category, matched by shared keywords in
//                       title/short_desc/body — surfaces complementary items
//                       (e.g. a whitening kit -> a whitening toothpaste, or a
//                       water flosser -> replacement jet tips).
// Pure build-time, static-export safe. Buyable/in-stock items are preferred but
// out-of-stock items still show (greyed CTA handled by the page), so the grid
// never looks empty on a thin category.

const STOP = new Set([
  "من", "في", "على", "مع", "الى", "إلى", "عن", "the", "and", "for", "with",
  "الأسنان", "أسنان", "العناية", "منتج", "منتجات", "طقم", "جهاز", "من",
  "hero", "value", "kit", "pro", "set",
]);

function norm(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/[\u064B-\u0652]/g, "")
    .replace(/[إأآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ـ/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(p) {
  const text = `${p.title_ar || ""} ${p.short_desc || ""} ${p.body_md || ""}`;
  const set = new Set();
  for (let w of norm(text).split(" ")) {
    if (w.startsWith("ال") && w.length > 4) w = w.slice(2);
    if (w.length >= 3 && !STOP.has(w)) set.add(w);
  }
  return set;
}

function overlap(a, b) {
  let n = 0;
  for (const w of a) if (b.has(w)) n++;
  return n;
}

/**
 * @param {object} current   the product being viewed
 * @param {array}  all       all products
 * @param {number} relLimit  max same-category picks
 * @param {number} simLimit  max cross-category picks
 */
export function getProductRecommendations(current, all, relLimit = 4, simLimit = 4) {
  const others = all.filter((p) => p.slug !== current.slug);
  const curTok = tokens(current);

  // 1) Same category — sort by keyword overlap, then in-stock first.
  const related = others
    .filter((p) => p.category === current.category)
    .map((p) => ({ p, score: overlap(curTok, tokens(p)) }))
    .sort((a, b) => b.score - a.score || (b.p.in_stock === true) - (a.p.in_stock === true))
    .slice(0, relLimit)
    .map((x) => x.p);

  const relatedSlugs = new Set(related.map((p) => p.slug));

  // 2) Cross-category — genuine keyword similarity, excludes already-shown.
  const similar = others
    .filter((p) => p.category !== current.category && !relatedSlugs.has(p.slug))
    .map((p) => ({ p, score: overlap(curTok, tokens(p)) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, simLimit)
    .map((x) => x.p);

  // Fallback: if too few cross-category matches, pad with popular-ish (has compare_at)
  if (similar.length < simLimit) {
    const have = new Set([...relatedSlugs, ...similar.map((p) => p.slug)]);
    for (const p of others) {
      if (similar.length >= simLimit) break;
      if (p.category === current.category || have.has(p.slug)) continue;
      similar.push(p);
      have.add(p.slug);
    }
  }

  return { related, similar };
}
