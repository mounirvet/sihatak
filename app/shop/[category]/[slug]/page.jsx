// app/shop/[category]/[slug]/page.jsx — product detail page.
// Static-export safe. Buy button links out to the Stripe-hosted Payment Link.

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "../../../../lib/storeCategories.js";
import {
  getAllProducts,
  getProductBySlug,
  isBuyable,
  SHOP_CURRENCY,
  SHOP_CURRENCY_SYMBOL_AR,
} from "../../../../lib/products.js";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({
    category: p.category,
    slug: p.slug,
  }));
}

export function generateMetadata({ params }) {
  const p = getProductBySlug(params.slug);
  if (!p) return {};
  return {
    title: `${p.title_ar} | متجر أسنانك`,
    description: p.short_desc,
    alternates: { canonical: `/shop/${p.category}/${p.slug}/` },
  };
}

export default function ProductPage({ params }) {
  const p = getProductBySlug(params.slug);
  if (!p || p.category !== params.category) notFound();

  const cat = getCategoryBySlug(p.category);
  const buyable = isBuyable(p);

  // Product schema for LLMO/GEO. Fuller schema layer lands in Batch S3.
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: p.title_ar,
    image: p.images,
    description: p.short_desc,
    sku: p.sku,
    offers: {
      "@type": "Offer",
      priceCurrency: p.currency || SHOP_CURRENCY,
      price: p.price,
      availability: p.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main dir="rtl" className="mx-auto max-w-5xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-ink/60">
        <Link href="/">الرئيسية</Link> <span>/</span>{" "}
        <Link href="/shop/">المتجر</Link> <span>/</span>{" "}
        <Link href={`/shop/${cat.slug}/`}>{cat.title_ar}</Link> <span>/</span>{" "}
        <span>{p.title_ar}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-sand">
          {p.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.images[0]}
              alt={p.title_ar}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div>
          <h1 className="font-display text-2xl text-teal-dark md:text-3xl">
            {p.title_ar}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-2xl text-teal-dark">
              {p.price} {SHOP_CURRENCY_SYMBOL_AR}
            </span>
            {p.compare_at_price ? (
              <span className="text-ink/40 line-through">
                {p.compare_at_price} {SHOP_CURRENCY_SYMBOL_AR}
              </span>
            ) : null}
          </div>

          <p className="mt-4 text-ink/80">{p.short_desc}</p>

          {/* Shipping notice — dropshipping honesty */}
          {p.shipping_days_min && p.shipping_days_max ? (
            <div className="mt-5 rounded-xl border border-mint bg-mint/30 p-4 text-sm text-teal-dark">
              🚚 مدة الشحن التقديرية: من {p.shipping_days_min} إلى{" "}
              {p.shipping_days_max} يوم عمل داخل دول الخليج.
            </div>
          ) : null}

          {/* Buy button -> Stripe-hosted checkout */}
          {buyable ? (
            <a
              href={p.stripe_payment_link}
              className="mt-6 inline-block w-full rounded-xl bg-teal px-6 py-4 text-center font-medium text-cream transition hover:bg-teal-dark"
            >
              اشترِ الآن
            </a>
          ) : (
            <button
              disabled
              className="mt-6 inline-block w-full cursor-not-allowed rounded-xl bg-ink/20 px-6 py-4 text-center font-medium text-ink/50"
            >
              {p.in_stock ? "غير متاح حاليًا" : "نفدت الكمية"}
            </button>
          )}

          <p className="mt-3 text-xs text-ink/50">
            يتم إتمام الدفع بشكل آمن عبر Stripe.
          </p>
        </div>
      </div>

      {/* Long description */}
      {p.body_md ? (
        <section className="prose prose-teal mt-10 max-w-none text-ink/85">
          {p.body_md.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </section>
      ) : null}

      {/* Content -> commerce link back to authority articles */}
      {p.related_articles.length > 0 ? (
        <section className="mt-10 border-t border-mint pt-6">
          <h2 className="font-display text-lg text-teal-dark">
            مقالات ذات صلة
          </h2>
          <ul className="mt-3 list-disc pr-5 text-teal">
            {p.related_articles.map((slug) => (
              <li key={slug}>
                <Link href={`/maqalat/${slug}/`}>{slug}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
