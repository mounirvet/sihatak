// app/shop/page.jsx — Shop home (noon-inspired redesign).
// Hero + visual category tile grid + promo banners + named product rails
// (featured spread, biggest discounts as an honest "عرض محدود" band) + trust footer.
// Static-export safe: pure build-time data, no client code.

import Link from "next/link";
import { STORE_CATEGORIES, SHOP_PROMOS } from "../../lib/storeCategories.js";
import {
  getProductsByCategory,
  getFeaturedSpread,
  getTopDiscounted,
} from "../../lib/products.js";
import { ShopIcon, IcLock, IcShip, IcReturn } from "../../components/ShopIcons.js";
import PromoBanners from "../../components/PromoBanners.jsx";
import ProductRail from "../../components/ProductRail.jsx";

export const metadata = {
  title: "المتجر | أسنانك",
  description:
    "متجر أسنانك لمنتجات العناية بالأسنان — تبييض، فرش كهربائية، عناية باللثة والتقويم الشفاف، وشحن إلى دول الخليج.",
  alternates: { canonical: "/shop/" },
};

export default function ShopHomePage() {
  const featured = getFeaturedSpread(8);
  const topDiscounted = getTopDiscounted(10);

  const tiles = STORE_CATEGORIES.map((c) => ({
    ...c,
    count: getProductsByCategory(c.slug).length,
  }));

  return (
    <main dir="rtl" className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-5 text-sm text-ink/60">
        <Link href="/">الرئيسية</Link> <span>/</span> <span>المتجر</span>
      </nav>

      {/* HERO */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-dark to-teal px-6 py-12 text-center text-cream md:py-16">
        <span aria-hidden="true" className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-cream/10 blur-2xl" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-coral/20 blur-2xl" />
        <h1 className="relative font-display text-3xl md:text-4xl">
          متجر منتجات العناية بالأسنان
        </h1>
        <p className="relative mx-auto mt-3 max-w-2xl text-cream/85">
          منتجات مختارة للعناية اليومية بأسنانك، مع شحن إلى دول الخليج ودفع آمن عبر Stripe.
        </p>
        <div className="relative mt-6 flex flex-wrap justify-center gap-5 text-sm text-cream/80">
          <span className="inline-flex items-center gap-1.5"><IcLock className="h-4 w-4" /> دفع آمن</span>
          <span className="inline-flex items-center gap-1.5"><IcShip className="h-4 w-4" /> شحن خليجي</span>
          <span className="inline-flex items-center gap-1.5"><IcReturn className="h-4 w-4" /> استرجاع 14 يوم</span>
        </div>
      </header>

      {/* CATEGORY TILE GRID */}
      <section className="mt-10">
        <h2 className="mb-5 font-display text-xl text-teal-dark md:text-2xl">تصفّح حسب الفئة</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {tiles.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}/`}
              className="group flex flex-col items-center gap-2 text-center"
            >
              <span className="flex aspect-square w-full items-center justify-center rounded-2xl bg-mint/50 text-teal-dark transition group-hover:bg-teal group-hover:text-cream group-hover:shadow-card">
                <ShopIcon name={cat.icon || "tooth"} className="h-8 w-8" />
              </span>
              <span className="text-xs font-medium leading-tight text-ink group-hover:text-teal">
                {cat.title_ar}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* PROMO BANNERS */}
      <section className="mt-10">
        <h2 className="mb-4 font-display text-xl text-teal-dark md:text-2xl">عروض لك</h2>
        <PromoBanners promos={SHOP_PROMOS} />
      </section>

      {/* FEATURED SPREAD RAIL */}
      <ProductRail title="منتجات مختارة" products={featured} viewAllHref="/shop/" />

      {/* BIGGEST DISCOUNTS — honest "عرض محدود" band, no fake countdown */}
      <ProductRail title="أكبر التخفيضات" products={topDiscounted} viewAllHref="/shop/" limited band />

      {/* Trust + policy links */}
      <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-6 text-sm text-teal">
        <Link href="/shop/al-shahn/" className="hover:underline">الشحن والتوصيل</Link>
        <Link href="/shop/al-istirja/" className="hover:underline">الاستبدال والاسترجاع</Link>
        <span className="inline-flex items-center gap-1.5 text-ink/50">
          <IcLock className="h-4 w-4" /> الدفع الآمن عبر Stripe
        </span>
      </div>
    </main>
  );
}
