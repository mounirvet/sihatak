// app/feed.xml/route.js
// Google Merchant Center product feed (RSS 2.0 + Google g: namespace).
//
// Served at https://asnanik.com/feed.xml — paste that URL into Merchant Center
// ("Add products from a file" → "Enter a link to your file"). Google re-reads
// it on a schedule, so price/stock changes in the .md files flow through
// automatically. No manual product entry.
//
// Feed discipline (YMYL + Google policy):
//   • Titles/descriptions are factual — no "cures/treats", no medical claims.
//   • Only in_stock products are listed.
//   • link points to the REAL /shop/{category}/{slug}/ page (matches price).
//   • image_link is absolute.
//   • brand: real brand if known, else the shop name.
//   • condition: new. availability: in stock.
//   • identifier_exists: false for items without a GTIN (Google-approved way to
//     say "no barcode" so the item isn't penalized for a missing GTIN).
//
// Static-export safe: force-static, no dynamic params.

import { getAllProducts } from "../../lib/products.js";
import { SITE } from "../../lib/site.js";

export const dynamic = "force-static";

function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Best-effort brand extraction from the Arabic title (Latin brand tokens are
// kept in titles per the shop's convention). Falls back to the shop name.
function guessBrand(p) {
  const t = p.title_ar || "";
  const known = [
    "RiseWell", "DR.DENT", "Hismile", "HiSmile", "Waterpik", "Philips",
    "Autobrush", "Bitvae", "Vibe", "GuruNanda", "Cocofloss", "Hello",
    "NOBS", "CEELIKE", "M3", "Dr.ville", "Flaus", "DenSureFit", "EELHOE",
  ];
  const hit = known.find((b) => t.includes(b));
  return hit || SITE.name;
}

// ---- product_type -----------------------------------------------------------
// OUR taxonomy (not Google's). This is what lets Shopping campaigns subdivide
// product groups by our real categories and bid differently per category — a
// 699 SAR electric brush justifies a much higher CPC than a 39 SAR mint pack.
// Google also uses product_type as a relevance signal when matching queries.
// Format: "Top > Sub" so it can be subdivided at either level.
const CATEGORY_LABELS = {
  "toothpaste": "العناية بالأسنان > معجون أسنان",
  "electric-brushes": "العناية بالأسنان > فرشاة كهربائية",
  "interdental-care": "العناية بالأسنان > تنظيف ما بين الأسنان",
  "mouthwash": "العناية بالفم > غسول فم",
  "fresh-breath": "العناية بالفم > انتعاش النفس",
  "whitening": "العناية بالأسنان > تبييض",
  "kids": "العناية بالأسنان > أطفال",
  "denture-care": "العناية بالأسنان > أطقم الأسنان",
  "aligner-care": "العناية بالأسنان > عناية بالتقويم الشفاف",
  "accessories": "العناية بالفم > إكسسوارات",
};

function productType(p) {
  return CATEGORY_LABELS[p.category] || "العناية بالفم والأسنان";
}

// ---- custom labels (bidding levers) -----------------------------------------
// custom_label_0 — price tier. Lets us bid by product value without hand-editing
// every product group. Thresholds match the catalogue's real spread (39–699).
function priceTier(price) {
  const v = Number(price) || 0;
  if (v >= 200) return "high";   // 200+ SAR — worth a higher CPC
  if (v >= 90) return "mid";     // 90–199 SAR
  return "low";                  // under 90 SAR — keep bids tight
}

// custom_label_1 — branded vs own-label. Branded items convert on brand-name
// searches and can carry higher bids; generics compete on price.
function brandTier(p, brand) {
  return brand === SITE.name ? "generic" : "branded";
}

// custom_label_2 — discount flag, useful for seasonal bid pushes.
function dealTier(p) {
  const was = Number(p.compare_at_price) || 0;
  const now = Number(p.price) || 0;
  if (was > now && now > 0) {
    const pct = Math.round(((was - now) / was) * 100);
    if (pct >= 25) return "sale-25plus";
    if (pct >= 10) return "sale-10plus";
  }
  return "no-sale";
}

export function GET() {
  const products = getAllProducts().filter((p) => p.in_stock && p.price);

  const items = products
    .map((p) => {
      const url = `${SITE.url}/shop/${p.category}/${p.slug}/`;
      const img = p.images?.[0] ? `${SITE.url}${p.images[0]}` : "";
      const brand = guessBrand(p);
      const desc = (p.short_desc || p.hero_tagline || p.title_ar || "").trim();
      const currency = p.currency || "SAR";

      // If there's a compare-at price, Google wants the ORIGINAL in <price> and
      // the current one in <sale_price> — that's what renders the struck-through
      // "was" price in Shopping results. Otherwise price alone.
      const was = Number(p.compare_at_price) || 0;
      const now = Number(p.price) || 0;
      const onSale = was > now && now > 0;
      const priceTag = onSale
        ? `      <g:price>${esc(`${was}.00 ${currency}`)}</g:price>
      <g:sale_price>${esc(`${now}.00 ${currency}`)}</g:sale_price>`
        : `      <g:price>${esc(`${now}.00 ${currency}`)}</g:price>`;

      // Extra images (up to 10 allowed). More images = better Shopping CTR.
      const extraImages = (p.images || [])
        .slice(1, 11)
        .map((i) => `      <g:additional_image_link>${esc(`${SITE.url}${i}`)}</g:additional_image_link>`)
        .join("\n");

      return `    <item>
      <g:id>${esc(p.sku || p.slug)}</g:id>
      <g:title>${esc(p.title_ar)}</g:title>
      <g:description>${esc(desc)}</g:description>
      <g:link>${esc(url)}</g:link>
      <g:image_link>${esc(img)}</g:image_link>
${extraImages ? extraImages + "\n" : ""}      <g:availability>in stock</g:availability>
${priceTag}
      <g:brand>${esc(brand)}</g:brand>
      <g:mpn>${esc(p.sku || p.slug)}</g:mpn>
      <g:condition>new</g:condition>
      <g:identifier_exists>false</g:identifier_exists>
      <g:google_product_category>469</g:google_product_category>
      <g:product_type>${esc(productType(p))}</g:product_type>
      <g:custom_label_0>${esc(priceTier(p.price))}</g:custom_label_0>
      <g:custom_label_1>${esc(brandTier(p, brand))}</g:custom_label_1>
      <g:custom_label_2>${esc(dealTier(p))}</g:custom_label_2>
      <g:custom_label_3>${esc(p.category || "")}</g:custom_label_3>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${esc(SITE.name)} — متجر العناية بالأسنان</title>
    <link>${esc(SITE.url)}/shop/</link>
    <description>منتجات العناية بالفم والأسنان من ${esc(SITE.name)}</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
