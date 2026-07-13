// lib/products.js
// Loads product content from content/products/*.md at build time.
// Pure filesystem reads -> fully compatible with Next.js output: 'export'.
// Mirrors the pattern used by the articles loader so it feels native to the repo.

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getCategoryBySlug } from "./storeCategories.js";

const PRODUCTS_DIR = path.join(process.cwd(), "content", "products");
const PUBLIC_DIR = path.join(process.cwd(), "public");

// Does this product have at least one image that ACTUALLY EXISTS on disk?
//
// We check the filesystem, not just `images.length`, because every product's
// frontmatter lists image paths whether or not the files were ever shipped.
// A product whose photos haven't been shot yet still has a populated `images:`
// array — it just renders as a placeholder tile. The frontmatter lies; the
// disk doesn't.
//
// Build-time only (Node), so this is free: no runtime cost, static-export safe.
export function hasRealImage(product) {
  const first = product?.images?.[0];
  if (!first) return false;
  // images are stored as site-absolute paths, e.g. "/images/shop/foo-1.jpg"
  return fs.existsSync(path.join(PUBLIC_DIR, first.replace(/^\//, "")));
}

// Single source of truth for shop currency presentation.
// Settlement currency is fixed by your Stripe GCC country; this only controls
// how prices are DISPLAYED on the site. Set once, used everywhere.
export const SHOP_CURRENCY = "SAR"; // Saudi Riyal — single GCC display+charge currency at launch
export const SHOP_CURRENCY_SYMBOL_AR = "ر.س"; // Arabic display symbol

function readProductFile(filename) {
  const fullPath = path.join(PRODUCTS_DIR, filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug: data.slug,
    title_ar: data.title_ar,
    category: data.category, // matches a storeCategories slug
    price: data.price, // number
    currency: data.currency || SHOP_CURRENCY,
    compare_at_price: data.compare_at_price ?? null, // optional strike-through
    images: data.images || [], // array of paths under /public
    short_desc: data.short_desc || "",
    shipping_days_min: data.shipping_days_min ?? null,
    shipping_days_max: data.shipping_days_max ?? null,
    stripe_payment_link: data.stripe_payment_link || "", // filled by generator script
    in_stock: data.in_stock !== false, // default true
    sku: data.sku || data.slug,
    brand_neutral: data.brand_neutral !== false, // sanity flag
    related_articles: data.related_articles || [], // slugs in /maqalat/
    // ---- premium page overrides (all optional) ----
    hero_tagline: data.hero_tagline || null,
    hero_claim: data.hero_claim || null,
    benefits: data.benefits || null,       // [[iconKey,title,text], ...]
    how_to: data.how_to || null,           // [[title,detail], ...]
    deep_desc: data.deep_desc || null,     // extra long-form description block(s)
    highlights: data.highlights || null,   // short bullet specs [str, ...]
    faq: data.faq || null,                 // [[q,a], ...] or [{q,a}]
    in_box: data.in_box || null,           // [{icon, qty, item}, ...]
    compare_table: data.compare_table || null,
    body_md: content, // long description, Markdown
  };
}

export function getAllProducts() {
  if (!fs.existsSync(PRODUCTS_DIR)) return [];
  return fs
    .readdirSync(PRODUCTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(readProductFile)
    .filter((p) => p.slug); // skip malformed
}

export function getProductBySlug(slug) {
  return getAllProducts().find((p) => p.slug === slug) || null;
}

export function getProductsByCategory(categorySlug) {
  return getAllProducts().filter((p) => p.category === categorySlug);
}

// Cheapest in-stock price in a category — powers the "ابتداءً من X ر.س" anchor
// on the shop-home tiles. Returns null for an empty category so the caller can
// omit the line rather than print "ابتداءً من 0".
//
// Out-of-stock products are excluded: anchoring on a price nobody can actually
// pay would be a bait number.
export function getCategoryMinPrice(categorySlug) {
  const prices = getAllProducts()
    .filter((p) => p.category === categorySlug && p.in_stock)
    .map((p) => p.price)
    .filter((n) => typeof n === "number" && n > 0);
  return prices.length ? Math.min(...prices) : null;
}

export function getAllProductSlugs() {
  return getAllProducts().map((p) => p.slug);
}

// Discount percentage (0 if none) — used by cards + "biggest discounts" rail.
export function discountPct(p) {
  return p.compare_at_price && p.compare_at_price > p.price
    ? Math.round((1 - p.price / p.compare_at_price) * 100)
    : 0;
}

// Products sorted by biggest discount first (in-stock preferred).
export function getTopDiscounted(limit = 10) {
  return getAllProducts()
    .filter((p) => discountPct(p) > 0)
    .sort(
      (a, b) =>
        // Products with a real photo always outrank placeholder tiles.
        hasRealImage(b) - hasRealImage(a) ||
        discountPct(b) - discountPct(a) ||
        (b.in_stock === true) - (a.in_stock === true)
    )
    .slice(0, limit);
}

// A stable "featured" pick: one product per category (widest spread), capped.
//
// Within each category we prefer a product that has a real photo. Previously
// this took whichever product sorted first by filename, so a category whose
// alphabetically-first product had no photo was PERMANENTLY represented by a
// placeholder tile — six of eight featured slots were empty tooth icons.
//
// Categories that have at least one photographed product are shown first, so
// the rail leads with real imagery and degrades gracefully at the tail.
export function getFeaturedSpread(limit = 8) {
  const byCat = {};
  for (const p of getAllProducts()) {
    const current = byCat[p.category];
    // Take the first product in the category, but upgrade to a photographed
    // one the moment we find it.
    if (!current || (!hasRealImage(current) && hasRealImage(p))) {
      byCat[p.category] = p;
    }
  }
  return Object.values(byCat)
    .sort((a, b) => hasRealImage(b) - hasRealImage(a))
    .slice(0, limit);
}

// Buyable = has a Stripe link AND is in stock. Used to gate the Buy button.
export function isBuyable(product) {
  return Boolean(product.stripe_payment_link) && product.in_stock;
}

// Lean catalog payload for the client-side ShopBrowser.
//
// The full product objects carry `body_md`, `faq`, `compare_table` etc — tens of
// KB we do NOT want serialized into the HTML for a search box. This ships only
// the fields the browser actually filters and renders on, keeping the inlined
// JSON small.
export function getCatalogForBrowser(products = null) {
  const list = products || getAllProducts();
  return list.map((p) => ({
    slug: p.slug,
    title_ar: p.title_ar,
    short_desc: p.short_desc,
    category: p.category,
    category_title: getCategoryBySlug(p.category)?.title_ar || "",
    price: p.price,
    compare_at_price: p.compare_at_price,
    in_stock: p.in_stock,
    image: hasRealImage(p) ? p.images[0] : null,
    has_image: hasRealImage(p),
  }));
}

// Convenience for category pages: attach the resolved category object.
export function withCategory(product) {
  return { ...product, categoryObj: getCategoryBySlug(product.category) };
}
