// lib/products.js
// Loads product content from content/products/*.md at build time.
// Pure filesystem reads -> fully compatible with Next.js output: 'export'.
// Mirrors the pattern used by the articles loader so it feels native to the repo.

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getCategoryBySlug } from "./storeCategories.js";

const PRODUCTS_DIR = path.join(process.cwd(), "content", "products");

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

export function getAllProductSlugs() {
  return getAllProducts().map((p) => p.slug);
}

// Buyable = has a Stripe link AND is in stock. Used to gate the Buy button.
export function isBuyable(product) {
  return Boolean(product.stripe_payment_link) && product.in_stock;
}

// Convenience for category pages: attach the resolved category object.
export function withCategory(product) {
  return { ...product, categoryObj: getCategoryBySlug(product.category) };
}
