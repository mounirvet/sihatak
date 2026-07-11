// app/shop/page.jsx — Shop home. Lists commercial categories.
// Static-export safe: no server code, pure build-time data.

import Link from "next/link";
import { STORE_CATEGORIES } from "../../lib/storeCategories.js";
import { getProductsByCategory } from "../../lib/products.js";

export const metadata = {
  title: "المتجر | أسنانك",
  description:
    "متجر أسنانك لمنتجات العناية بالأسنان — تبييض، فرش كهربائية، عناية باللثة والتقويم الشفاف، وشحن إلى دول الخليج.",
  alternates: { canonical: "/shop/" },
};

export default function ShopHomePage() {
  return (
    <main dir="rtl" className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink/60">
        <Link href="/">الرئيسية</Link> <span>/</span> <span>المتجر</span>
      </nav>

      <header className="mb-10">
        <h1 className="font-display text-3xl text-teal-dark md:text-4xl">
          متجر منتجات العناية بالأسنان
        </h1>
        <p className="mt-3 max-w-2xl text-ink/80">
          منتجات مختارة للعناية اليومية بأسنانك، مع شحن إلى دول الخليج. تصفّح
          حسب الفئة أدناه.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STORE_CATEGORIES.map((cat) => {
          const count = getProductsByCategory(cat.slug).length;
          return (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}/`}
              className="group rounded-2xl border border-mint bg-cream p-6 transition hover:border-teal hover:shadow-md"
            >
              <h2 className="font-display text-xl text-teal-dark">
                {cat.title_ar}
              </h2>
              <p className="mt-2 text-sm text-ink/70">{cat.blurb_ar}</p>
              <span className="mt-4 inline-block text-sm text-coral">
                {count > 0 ? `${count} منتج` : "قريبًا"} ←
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
