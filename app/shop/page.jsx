// app/shop/page.jsx — Shop home. Lists commercial categories.
// Static-export safe: no server code, pure build-time data.

import Link from "next/link";
import { STORE_CATEGORIES } from "../../lib/storeCategories.js";
import { ShopIcon, IcLock, IcShip, IcReturn } from "../../components/ShopIcons.js";
import {
  getProductsByCategory,
  getAllProducts,
  SHOP_CURRENCY_SYMBOL_AR,
} from "../../lib/products.js";

export const metadata = {
  title: "المتجر | أسنانك",
  description:
    "متجر أسنانك لمنتجات العناية بالأسنان — تبييض، فرش كهربائية، عناية باللثة والتقويم الشفاف، وشحن إلى دول الخليج.",
  alternates: { canonical: "/shop/" },
};

export default function ShopHomePage() {
  const featured = getAllProducts().slice(0, 4);
  return (
    <main dir="rtl" className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink/60">
        <Link href="/">الرئيسية</Link> <span>/</span> <span>المتجر</span>
      </nav>

      {/* Hero band */}
      <header className="mb-10 rounded-2xl bg-teal-dark px-6 py-10 text-center text-cream md:py-14">
        <h1 className="font-display text-3xl md:text-4xl">
          متجر منتجات العناية بالأسنان
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-cream/85">
          منتجات مختارة للعناية اليومية بأسنانك، مع شحن إلى دول الخليج ودفع آمن عبر Stripe.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-5 text-sm text-cream/75">
          <span className="inline-flex items-center gap-1.5"><IcLock className="h-4 w-4" /> دفع آمن</span>
          <span className="inline-flex items-center gap-1.5"><IcShip className="h-4 w-4" /> شحن خليجي</span>
          <span className="inline-flex items-center gap-1.5"><IcReturn className="h-4 w-4" /> استرجاع 14 يوم</span>
        </div>
      </header>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-5 font-display text-xl text-teal-dark">منتجات مختارة</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {featured.map((p) => {
              const savePct =
                p.compare_at_price && p.compare_at_price > p.price
                  ? Math.round((1 - p.price / p.compare_at_price) * 100)
                  : null;
              return (
                <Link
                  key={p.slug}
                  href={`/shop/${p.category}/${p.slug}/`}
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
                      <img src={p.images[0]} alt={p.title_ar} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
                    ) : (
                      <ShopIcon name="tooth" className="h-10 w-10 text-teal/25" />
                    )}
                  </div>
                  <h3 className="mt-3 text-sm font-medium text-ink line-clamp-2">{p.title_ar}</h3>
                  <div className="mt-2 font-display text-teal-dark">
                    {p.price} {SHOP_CURRENCY_SYMBOL_AR}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <h2 className="mb-5 font-display text-xl text-teal-dark">تصفّح حسب الفئة</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STORE_CATEGORIES.map((cat) => {
          const count = getProductsByCategory(cat.slug).length;
          return (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}/`}
              className="group rounded-2xl border border-mint bg-cream p-6 transition hover:border-teal hover:shadow-md"
            >
              <h3 className="font-display text-xl text-teal-dark">
                {cat.title_ar}
              </h3>
              <p className="mt-2 text-sm text-ink/70">{cat.blurb_ar}</p>
              <span className="mt-4 inline-block text-sm text-coral">
                {count > 0 ? `${count} منتج` : "قريبًا"} ←
              </span>
            </Link>
          );
        })}
      </div>

      {/* Trust + policy links */}
      <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-mint pt-6 text-sm text-teal">
        <Link href="/shop/al-shahn/" className="hover:underline">
          الشحن والتوصيل
        </Link>
        <Link href="/shop/al-istirja/" className="hover:underline">
          الاستبدال والاسترجاع
        </Link>
        <span className="text-ink/50">الدفع الآمن عبر Stripe</span>
      </div>
    </main>
  );
}
