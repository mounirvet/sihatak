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

export function GET() {
  const products = getAllProducts().filter((p) => p.in_stock && p.price);

  const items = products
    .map((p) => {
      const url = `${SITE.url}/shop/${p.category}/${p.slug}/`;
      const img = p.images?.[0] ? `${SITE.url}${p.images[0]}` : "";
      const brand = guessBrand(p);
      const desc = (p.short_desc || p.hero_tagline || p.title_ar || "").trim();
      const price = `${p.price}.00 ${p.currency || "SAR"}`;

      return `    <item>
      <g:id>${esc(p.sku || p.slug)}</g:id>
      <g:title>${esc(p.title_ar)}</g:title>
      <g:description>${esc(desc)}</g:description>
      <g:link>${esc(url)}</g:link>
      <g:image_link>${esc(img)}</g:image_link>
      <g:availability>in stock</g:availability>
      <g:price>${esc(price)}</g:price>
      <g:brand>${esc(brand)}</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>false</g:identifier_exists>
      <g:google_product_category>469</g:google_product_category>
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
