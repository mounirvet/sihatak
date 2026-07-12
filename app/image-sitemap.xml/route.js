// app/image-sitemap.xml/route.js
// Dedicated IMAGE sitemap (Google Image sitemap extension).
//
// Why this exists: the standard sitemap lists pages, not images. Google Images
// is a real traffic channel for a product shop — an image sitemap tells Google
// exactly which images belong to which product page, with an Arabic caption and
// title for each. Without it, images 2..5 of every product are often never
// crawled at all.
//
// Static-export safe: force-static + no dynamic params.

import { getAllProducts } from "../../lib/products.js";
import { imageAlt } from "../../lib/imageSeo.js";
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

export function GET() {
  const products = getAllProducts();

  const urls = products
    .map((p) => {
      const loc = `${SITE.url}/shop/${p.category}/${p.slug}/`;
      const imgs = (p.images || [])
        .map((src, i) => {
          const abs = src.startsWith("http") ? src : `${SITE.url}${src}`;
          return `    <image:image>
      <image:loc>${esc(abs)}</image:loc>
      <image:title>${esc(p.title_ar)}</image:title>
      <image:caption>${esc(imageAlt(p, i))}</image:caption>
    </image:image>`;
        })
        .join("\n");

      return `  <url>
    <loc>${esc(loc)}</loc>
${imgs}
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
