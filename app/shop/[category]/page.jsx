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
  getCatalogForBrowser,
} from "../../../lib/products.js";
import { ShopIcon, IcLock, IcShip, IcReturn } from "../../../components/ShopIcons.js";
import ShopProductCard from "../../../components/ShopProductCard.jsx";
import ShopBrowser from "../../../components/ShopBrowser.jsx";

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
  // Search + sort earns its space only when there's enough to actually sift
  // through. On a 2-product category the controls are pure noise, so we fall
  // back to the plain grid.
  const useBrowser = products.length >= 4;
  const catalog = useBrowser ? getCatalogForBrowser(products) : null;

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
      ) : useBrowser ? (
        <ShopBrowser products={catalog} showCategoryFilter={false} />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ShopProductCard key={p.slug} p={p} />
          ))}
        </div>
      )}

      {/* Trust strip */}
      <div className="mt-10 grid grid-cols-3 gap-3 border-t border-mint pt-6 text-center text-xs text-ink/60">
        <div className="flex flex-col items-center gap-1.5"><IcLock className="h-5 w-5 text-teal" />دفع آمن عبر Stripe</div>
        <div className="flex flex-col items-center gap-1.5"><IcShip className="h-5 w-5 text-teal" />شحن عالمي</div>
        <div className="flex flex-col items-center gap-1.5"><IcReturn className="h-5 w-5 text-teal" />استرجاع خلال 14 يوم</div>
      </div>
    </main>
  );
}
