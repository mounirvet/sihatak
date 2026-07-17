import { SITE, PILLARS } from '../lib/site';
import { getAllArticles } from '../lib/content';
import { getGlossarySlugs } from '../lib/glossary';
import { getAllInsights } from '../lib/insights';
import { getToolSlugs, getProductSlugs } from '../lib/tools';
import { getAllProducts } from '../lib/products';
import { STORE_CATEGORIES } from '../lib/storeCategories';

export const dynamic = 'force-static';

// Stable fallback date for pages that have no real per-item "last changed"
// signal (static pages, pillar index pages, the glossary/tools arrays).
// Using a fixed constant — not `new Date()` — means these URLs stop falsely
// claiming they changed on every rebuild, which is exactly the noise that
// makes Google ignore <lastmod>. Bump this only when those sections actually
// change in a meaningful way.
const SITE_BASELINE = new Date('2026-06-01T00:00:00.000Z');

// Coerce a frontmatter date (string | Date | undefined) into a valid Date,
// falling back to the site baseline when missing or unparseable. This keeps
// the build from crashing on a single article with a typo'd date.
function toDate(value) {
  if (!value) return SITE_BASELINE;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? SITE_BASELINE : d;
}

export default async function sitemap() {
  // --- Static pages: stable baseline (they rarely change; no fake churn) ---
  const staticPages = [
    '', '/mahawir', '/maqalat', '/jadeed', '/mustalahat', '/bahth', '/adawat',
    '/man-nahnu', '/man-nahnu/al-fariq-al-tibbi', '/man-nahnu/siyasat-al-tahrir',
    '/man-nahnu/al-masadir', '/man-nahnu/siyasat-al-khususiyya',
    '/man-nahnu/shurut-al-istikhdam', '/man-nahnu/ittasil-bina',
    '/man-nahnu/ikhla-al-masuliyya', '/man-nahnu/al-ifsah',
  ];
  const pages = staticPages.map((p) => ({
    url: `${SITE.url}${p}/`,
    lastModified: SITE_BASELINE,
  }));

  // --- Pillar pages: stable baseline ---
  const pillarPages = PILLARS.map((p) => ({
    url: `${SITE.url}/mahawir/${p.slug}/`,
    lastModified: SITE_BASELINE,
  }));

  // --- Articles: REAL per-page date from frontmatter (updated > date) ---
  // This is the core of the fix: every article reports when it actually
  // changed, so <lastmod> becomes a truthful recrawl signal again.
  const allArticles = await getAllArticles();
  const articlePages = allArticles.map((a) => ({
    url: `${SITE.url}/maqalat/${a.slug}/`,
    lastModified: toDate(a.meta?.updated || a.meta?.date),
  }));

  // --- Insights: REAL per-page date from frontmatter ---
  const allInsights = await getAllInsights();
  const insightPages = allInsights.map((i) => ({
    url: `${SITE.url}/jadeed/${i.slug}/`,
    lastModified: toDate(i.meta?.updated || i.meta?.date),
  }));

  // --- Glossary: static array, no per-item date -> stable baseline ---
  const glossaryPages = getGlossarySlugs().map((slug) => ({
    url: `${SITE.url}/mustalahat/${slug}/`,
    lastModified: SITE_BASELINE,
  }));

  // --- Tools / products: static arrays, no per-item date -> stable baseline ---
  const toolCategoryPages = getToolSlugs().map((slug) => ({
    url: `${SITE.url}/adawat/${slug}/`,
    lastModified: SITE_BASELINE,
  }));
  const productPages = getProductSlugs().map((slug) => ({
    url: `${SITE.url}/adawat/muntaj/${slug}/`,
    lastModified: SITE_BASELINE,
  }));

  // --- SHOP: the real e-commerce pages (buy buttons, bundles, Snipcart). These
  // are the converting pages and MUST be indexable. /adawat/muntaj canonicals
  // defer to these, so no cannibalization. ---
  const shopIndex = [{ url: `${SITE.url}/shop/`, lastModified: SITE_BASELINE }];
  const shopCategoryPages = STORE_CATEGORIES.map((c) => ({
    url: `${SITE.url}/shop/${c.slug}/`,
    lastModified: SITE_BASELINE,
  }));
  const shopProductPages = getAllProducts().map((p) => ({
    url: `${SITE.url}/shop/${p.category}/${p.slug}/`,
    lastModified: SITE_BASELINE,
  }));

  return [
    ...pages,
    ...pillarPages,
    ...articlePages,
    ...insightPages,
    ...glossaryPages,
    ...toolCategoryPages,
    ...productPages,
    ...shopIndex,
    ...shopCategoryPages,
    ...shopProductPages,
  ];
}
