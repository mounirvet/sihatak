// app/shop/[category]/page.jsx — one page per commercial category.
// generateStaticParams -> every category pre-rendered at build (export-safe).

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  STORE_CATEGORIES,
  getCategoryBySlug,
  allCategorySlugs,
} from "../../../lib/storeCategories.js";
import {
  getProductsByCategory,
  SHOP_CURRENCY_SYMBOL_AR,
} from "../../../lib/products.js";

export function generateStaticParams() {
  return allCategorySlugs().map((category) => ({ category }));
}

export function generateMetadata({ params }) {
  const cat = getCategoryBySlug(params.category);
  if (!cat) return {};
  return {
    title: `${cat.title_ar} | متجر أسنانك`,
    description: cat.blurb_ar,
    alternates: { canonical: `/shop/${cat.slug}/` },
  };
}

export default function CategoryPage({ params }) {
  const cat = getCategoryBySlug(params.category);
  if (!cat) notFound();

  const products = getProductsByCategory(cat.slug);

  return (
    <main dir="rtl" className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink/60">
        <Link href="/">الرئيسية</Link> <span>/</span>{" "}
        <Link href="/shop/">المتجر</Link> <span>/</span>{" "}
        <span>{cat.title_ar}</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-display text-3xl text-teal-dark">{cat.title_ar}</h1>
        <p className="mt-2 max-w-2xl text-ink/80">{cat.blurb_ar}</p>
      </header>

      {products.length === 0 ? (
        <p className="text-ink/60">منتجات هذه الفئة قريبًا.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => {
            const savePct =
              p.compare_at_price && p.compare_at_price > p.price
                ? Math.round((1 - p.price / p.compare_at_price) * 100)
                : null;
            return (
              <Link
                key={p.slug}
                href={`/shop/${cat.slug}/${p.slug}/`}
                className="group relative rounded-xl border border-mint bg-cream p-3 transition hover:border-teal hover:shadow-md"
              >
                {savePct ? (
                  <span className="absolute right-3 top-3 z-10 rounded-full bg-coral px-2 py-0.5 text-xs font-bold text-white">
                    -{savePct}٪
                  </span>
                ) : null}
                <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-sand">
                  {p.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.images[0]}
                      alt={p.title_ar}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-3xl text-teal/20">🦷</span>
                  )}
                </div>
                <h2 className="mt-3 text-sm font-medium text-ink line-clamp-2">
                  {p.title_ar}
                </h2>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-teal-dark">
                    {p.price} {SHOP_CURRENCY_SYMBOL_AR}
                  </span>
                  {p.compare_at_price ? (
                    <span className="text-xs text-ink/40 line-through">
                      {p.compare_at_price}
                    </span>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Trust strip */}
      <div className="mt-10 grid grid-cols-3 gap-3 border-t border-mint pt-6 text-center text-xs text-ink/60">
        <div>🔒<br />دفع آمن عبر Stripe</div>
        <div>🚚<br />شحن إلى دول الخليج</div>
        <div>↩️<br />استرجاع خلال 14 يوم</div>
      </div>
    </main>
  );
}
