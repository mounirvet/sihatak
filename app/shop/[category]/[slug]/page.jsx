// app/shop/[category]/[slug]/page.jsx — PREMIUM conversion product page (v2).
// Benefit-first, aspirational, confident. Real claims featured boldly; the single
// dentist note is a trust signal, not a disclaimer on every line.
//
// v2 additions: related products (same category), similar products (cross-category),
// a deeper description block, a "كيفية الاستخدام" (how-to-use) section, premium
// interactive CTAs, and ZERO emojis — every glyph is an inline SVG icon.

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "../../../../lib/storeCategories.js";
import { getArticleMeta } from "../../../../lib/content.js";
import { SITE } from "../../../../lib/site.js";
import { ShareRow } from "../../../../components/UXParts.js";
import { getSellCopy } from "../../../../lib/shopCopy.js";
import { getProductRecommendations } from "../../../../lib/productRelated.js";
import ProductGallery from "../../../../components/ProductGallery.jsx";
import BuyButton from "../../../../components/BuyButton.jsx";
import BundleSelector from "../../../../components/BundleSelector.jsx";
import WishlistButton from "../../../../components/WishlistButton.jsx";
import ProductAnalytics from "../../../../components/ProductAnalytics.jsx";
import Reveal from "../../../../components/Reveal.jsx";
import ShippingInfo from "../../../../components/ShippingInfo.jsx";
import { DeliveryEstimate, PaymentMethods, FeatureChips } from "../../../../components/TrustStrip.jsx";
import { SectionNav, StickyBuyBar } from "../../../../components/StickyNav.jsx";
import InTheBox from "../../../../components/InTheBox.jsx";
import Reviews from "../../../../components/Reviews.jsx";
import { ShopIcon, IcLock, IcReturn, IcVerified, IcShield, IcChevron, IcCircleCheck, IcInfo } from "../../../../components/ShopIcons.js";
import {
  getAllProducts,
  getProductBySlug,
  isBuyable,
  SHOP_CURRENCY,
  SHOP_CURRENCY_SYMBOL_AR,
} from "../../../../lib/products.js";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ category: p.category, slug: p.slug }));
}

export function generateMetadata({ params }) {
  const p = getProductBySlug(params.slug);
  if (!p) return {};

  const url = `${SITE.url}/shop/${p.category}/${p.slug}/`;
  // Share cards need an ABSOLUTE image URL — relative paths render no preview.
  const img =
    p.images && p.images[0]
      ? (p.images[0].startsWith("http") ? p.images[0] : `${SITE.url}${p.images[0]}`)
      : `${SITE.url}/images/og-default.jpg`;

  return {
    title: `${p.title_ar} | متجر أسنانك`,
    description: p.short_desc,
    alternates: { canonical: `/shop/${p.category}/${p.slug}/` },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: "ar_AR",
      url,
      title: p.title_ar,
      description: p.short_desc,
      images: [{ url: img, width: 1200, height: 1200, alt: p.title_ar }],
    },
    twitter: {
      card: "summary_large_image",
      title: p.title_ar,
      description: p.short_desc,
      images: [img],
    },
  };
}

const CATEGORY_COMPARE = {
  "interdental-care": {
    cols: ["الخيط المائي", "الخيط العادي"],
    rows: [
      ["الوصول لما بين الأسنان", "نفث ماء موجّه", "قد يصعب في الأماكن الضيقة"],
      ["مع التقويم والجسور", "رأس مخصص متوفّر", "أصعب في الاستخدام"],
      ["سهولة الاستخدام", "بضغطة زر", "يتطلّب مهارة يدوية"],
    ],
  },
  "electric-brushes": {
    cols: ["الفرشاة الكهربائية", "الفرشاة اليدوية"],
    rows: [
      ["حركة التنظيف", "اهتزاز صوتي منتظم", "تعتمد على حركة اليد"],
      ["مؤقّت مدمج", "نعم", "لا"],
      ["مستشعر ضغط", "متوفّر في بعض الطُرز", "لا"],
    ],
  },
};

const CATEGORY_FAQ = {
  "interdental-care": [
    ["هل يغني الخيط المائي عن الخيط العادي؟",
      "يعتبره كثير من أطباء الأسنان وسيلة مكمّلة فعّالة، وقد يكون بديلاً عمليًا لمن يجد صعوبة في الخيط العادي."],
    ["كم مرة يُستخدم؟",
      "يُستخدم عادةً مرة يوميًا ضمن روتين العناية للحصول على أفضل إحساس بالنظافة."],
    ["هل يناسب من يرتدون التقويم؟",
      "نعم، وغالبًا يُرفق رأس مخصص لذلك ليصل بسهولة حول أسلاك التقويم."],
  ],
  "electric-brushes": [
    ["متى أستبدل رأس الفرشاة؟",
      "يُنصح عمومًا بالاستبدال كل ثلاثة أشهر تقريبًا أو عند تآكل الشعيرات للحفاظ على أفضل تنظيف."],
    ["هل تناسب الأسنان الحساسة؟",
      "نعم، كثير من الطُرز توفّر وضعًا لطيفًا مصمّمًا خصيصًا للأسنان الحساسة."],
  ],
  whitening: [
    ["متى أرى النتيجة؟",
      "يختلف الأمر من شخص لآخر، ويلاحظ كثير من المستخدمين فرقًا تدريجيًا مع الاستخدام المنتظم."],
    ["هل يسبب حساسية؟",
      "صُمّم هذا النوع ليكون لطيفًا مع التركيز على تقليل الإحساس بالحساسية أثناء الاستخدام."],
  ],
};

// Compact product card reused by related + similar grids.
function MiniProductCard({ p, currency }) {
  const savePct =
    p.compare_at_price && p.compare_at_price > p.price
      ? Math.round((1 - p.price / p.compare_at_price) * 100)
      : null;
  return (
    <Link
      href={`/shop/${p.category}/${p.slug}/`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-cream transition hover:-translate-y-1 hover:border-teal hover:shadow-card"
    >
      {savePct ? (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-coral px-2 py-0.5 text-xs font-bold text-white shadow">
          -{savePct}٪
        </span>
      ) : null}
      <div className="flex aspect-square items-center justify-center overflow-hidden bg-white">
        {p.images && p.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.images[0]}
            alt={p.title_ar}
            loading="lazy"
            className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105"
          />
        ) : (
          <ShopIcon name="tooth" className="h-10 w-10 text-teal/25" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-ink">{p.title_ar}</h3>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="font-display font-bold text-teal-dark">{p.price} {currency}</span>
          {p.compare_at_price ? (
            <span className="text-xs text-ink/40 line-through">{p.compare_at_price}</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export default function ProductPage({ params }) {
  const p = getProductBySlug(params.slug);
  if (!p || p.category !== params.category) notFound();

  const cat = getCategoryBySlug(p.category);
  const buyable = isBuyable(p);
  const currency = SHOP_CURRENCY_SYMBOL_AR;
  const sell = getSellCopy(p);

  const allProducts = getAllProducts();
  const { related, similar } = getProductRecommendations(p, allProducts, 4, 4);

  const compare = p.compare_table || CATEGORY_COMPARE[p.category] || null;
  const faqs =
    (Array.isArray(p.faq) && p.faq.length
      ? p.faq.map((f) => (Array.isArray(f) ? f : [f.q, f.a]))
      : CATEGORY_FAQ[p.category]) || [];

  const relatedArticles = (p.related_articles || []).map((slug) => {
    try {
      const { meta } = getArticleMeta(slug);
      return { slug, title: meta.title || slug };
    } catch {
      return { slug, title: slug };
    }
  });

  const savePct =
    p.compare_at_price && p.compare_at_price > p.price
      ? Math.round((1 - p.price / p.compare_at_price) * 100)
      : null;
  const saveAmt =
    p.compare_at_price && p.compare_at_price > p.price
      ? p.compare_at_price - p.price
      : null;

  // Deep description = deep_desc override, else body_md. Split into paragraphs.
  const deepParas = (p.deep_desc || p.body_md || "")
    .split("\n\n")
    .map((s) => s.trim())
    .filter(Boolean);

  // Price valid until end of next year — a rolling, always-future date so the
  // Offer never shows as stale in Search Console (Google warns on past dates).
  const priceValidUntil = `${new Date().getFullYear() + 1}-12-31`;

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: p.title_ar,
    image: p.images?.map((img) => `${SITE.url}${img}`),
    description: p.short_desc,
    sku: p.sku,
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/shop/${p.category}/${p.slug}/`,
      priceCurrency: p.currency || SHOP_CURRENCY,
      price: p.price,
      priceValidUntil,
      itemCondition: "https://schema.org/NewCondition",
      availability: p.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SITE.name },
    },
  };

  // BreadcrumbList: puts "المتجر › الفئة › المنتج" in the search result instead
  // of a bare URL. Built from the real category title.
  const breadcrumbLd = {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "المتجر", item: `${SITE.url}/shop/` },
      cat && {
        "@type": "ListItem",
        position: 2,
        name: cat.title_ar,
        item: `${SITE.url}/shop/${p.category}/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: p.title_ar,
        item: `${SITE.url}/shop/${p.category}/${p.slug}/`,
      },
    ].filter(Boolean),
  };

  // Lean product snapshot for analytics + wishlist. Deliberately NOT the whole
  // product object — `body_md`, `faq` etc would be serialized into the HTML for
  // no reason.
  // Snipcart requires ABSOLUTE url + image: it crawls `data-item-url` to
  // re-validate the price, and can't resolve a relative "/images/..." path.
  const productLite = {
    slug: p.slug,
    title_ar: p.title_ar,
    category: p.category,
    price: p.price,
    compare_at_price: p.compare_at_price ?? null,
    short_desc: p.short_desc || "",
    image: p.images?.[0] || null,                                  // relative, for wishlist UI
    imageAbs: p.images?.[0] ? `${SITE.url}${p.images[0]}` : null,  // absolute, for Snipcart
    url: `${SITE.url}/shop/${p.category}/${p.slug}/`,
  };

  const buyProps = {
    price: p.price,
    currency,
    buyable,
    inStock: p.in_stock,
    product: productLite,
  };

  return (
    <article dir="rtl" className="bg-sand pb-24 md:pb-10">
      <ProductAnalytics product={productLite} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
        }) }} />
      )}

      <div className="mx-auto max-w-5xl px-4 py-6">
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-ink/50">
          <Link href="/" className="hover:text-teal">الرئيسية</Link><span>/</span>
          <Link href="/shop/" className="hover:text-teal">المتجر</Link><span>/</span>
          <Link href={`/shop/${cat.slug}/`} className="hover:text-teal">{cat.title_ar}</Link><span>/</span>
          <span className="text-ink/70">{p.title_ar}</span>
        </nav>

        {/* HERO */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative">
            {savePct && (
              <span className="absolute right-4 top-4 z-10 rounded-full bg-coral px-3 py-1 text-sm font-bold text-white shadow">
                وفّر {savePct}٪
              </span>
            )}
            <ProductGallery images={p.images} alt={p.title_ar} />
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold leading-tight text-ink md:text-3xl">
              {p.title_ar}
            </h1>
            {sell.tagline && (
              <p className="mt-2 font-display text-lg text-teal">{sell.tagline}</p>
            )}


            {sell.heroClaim && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-dark px-4 py-2 text-sm font-bold text-cream">
                <ShopIcon name="spark" className="h-4 w-4" /> {sell.heroClaim}
              </div>
            )}

            <div className="mt-5 flex items-end gap-3">
              <span className="font-display text-4xl font-bold text-teal-dark">
                {p.price} {currency}
              </span>
              {p.compare_at_price && (
                <span className="mb-1 text-xl text-ink/40 line-through">
                  {p.compare_at_price} {currency}
                </span>
              )}
            </div>
            {saveAmt && (
              <p className="mt-1 text-sm font-medium text-coral">
                توفّر {saveAmt} {currency} اليوم
              </p>
            )}
            <p className="mt-1 flex items-center gap-1.5 text-xs text-ink/50">
              <IcLock className="h-3.5 w-3.5" /> شامل الضريبة · دفع آمن عبر Stripe
            </p>

            {/* quick highlights */}
            {Array.isArray(p.highlights) && p.highlights.length > 0 && (
              <ul className="mt-5 space-y-2">
                {p.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink/80">
                    <IcCircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}

            <FeatureChips chips={p.trust_chips} />

            <ShippingInfo />

            <DeliveryEstimate minDays={p.shipping_days_min} maxDays={p.shipping_days_max} />

            <div id="primary-cta" className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
              {Array.isArray(p.bundles) && p.bundles.length > 1 ? (
                <div className="flex-1">
                  <BundleSelector
                    product={productLite}
                    bundles={p.bundles}
                    currency={currency}
                    buyable={buyable}
                  />
                </div>
              ) : (
                <BuyButton {...buyProps} big block className="flex-1" />
              )}
              <WishlistButton product={productLite} size="lg" className="shrink-0 sm:!h-[68px] sm:!w-14" />
            </div>

            <PaymentMethods />

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-ink/60">
              <div className="flex flex-col items-center gap-1 rounded-lg border border-line bg-cream p-3">
                <IcLock className="h-5 w-5 text-teal" /> دفع آمن
              </div>
              <div className="flex flex-col items-center gap-1 rounded-lg border border-line bg-cream p-3">
                <IcReturn className="h-5 w-5 text-teal" /> استرجاع 14 يوم
              </div>
              <div className="flex flex-col items-center gap-1 rounded-lg border border-line bg-cream p-3">
                <IcVerified className="h-5 w-5 text-teal" /> منتج أصلي
              </div>
            </div>
          </div>
        </div>

        {/* WHY YOU'LL LOVE IT */}
        {sell.sellBenefits.length > 0 && (
          <Reveal as="section" className="mt-16">
            <h2 className="mb-6 text-center font-display text-2xl text-teal-dark">لماذا ستحبّه</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {sell.sellBenefits.map((b, i) => (
                <div key={i} className="group rounded-2xl border border-line bg-cream p-6 text-center transition hover:-translate-y-1 hover:border-teal hover:shadow-card">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-mint text-teal-dark transition group-hover:bg-teal group-hover:text-cream">
                    <ShopIcon name={b[0]} className="h-7 w-7" />
                  </div>
                  <div className="font-display text-lg text-ink">{b[1]}</div>
                  <div className="mt-2 text-sm text-ink/70">{b[2]}</div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* DEEP DESCRIPTION */}
        {deepParas.length > 0 && (
          <Reveal as="section" className="mt-16">
            <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
              <div>
                <h2 className="font-display text-2xl text-teal-dark">عن المنتج</h2>
                <p className="mt-2 text-sm text-ink/60">كل ما تريد معرفته قبل الطلب.</p>
              </div>
              <div className="prose-ar max-w-none space-y-4 text-[15px] leading-relaxed text-ink/85">
                {deepParas.map((para, i) => {
                  // bold-lead markdown "**...**" stays readable as a subheading
                  const m = para.match(/^\*\*(.+?)\*\*\s*(.*)$/s);
                  if (m) {
                    return (
                      <p key={i}>
                        <span className="font-display font-bold text-teal-dark">{m[1]}</span>
                        {m[2] ? ` ${m[2]}` : ""}
                      </p>
                    );
                  }
                  return <p key={i}>{para}</p>;
                })}
              </div>
            </div>
          </Reveal>
        )}

        {/* HOW TO USE */}
        {sell.howTo.length > 0 && (
          <Reveal as="section" className="mt-16 rounded-3xl bg-teal-dark px-6 py-10 md:px-10">
            <div className="mb-8 text-center">
              <h2 className="font-display text-2xl font-bold text-cream">كيفية الاستخدام</h2>
              <p className="mt-2 text-sm text-cream/70">خطوات بسيطة للحصول على أفضل نتيجة.</p>
            </div>
            <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {sell.howTo.map(([title, detail], i) => (
                <li
                  key={i}
                  className="relative rounded-2xl border border-cream/15 bg-cream/[0.07] p-5 transition hover:border-coral/50 hover:bg-cream/[0.12]"
                >
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-coral font-display text-lg font-bold text-white shadow-[0_6px_18px_-6px_rgba(224,120,86,0.9)]">
                    {i + 1}
                  </span>
                  <div className="font-display text-base font-bold text-cream">{title}</div>
                  <p className="mt-2 text-sm leading-relaxed text-cream/80">{detail}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        )}

        {/* WHAT'S IN THE BOX */}
        {Array.isArray(p.in_box) && p.in_box.length > 0 && (
          <Reveal as="section" className="mt-16">
            <InTheBox items={p.in_box} />
          </Reveal>
        )}

        {/* REVIEWS */}
        <Reveal as="section" className="mt-16">
          <Reviews productSlug={p.slug} productName={p.title_ar} />
        </Reveal>

        {/* COMPARE */}
        {compare && compare.rows && (
          <Reveal as="section" className="mt-16">
            <h2 className="mb-5 font-display text-xl text-teal-dark">لماذا الخيار الأفضل</h2>
            <div className="overflow-hidden rounded-2xl border border-line">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-teal-dark text-cream">
                    <th className="p-3 text-right font-display font-normal"></th>
                    <th className="p-3 text-center font-display font-bold">{compare.cols[0]}</th>
                    <th className="p-3 text-center font-display font-normal text-cream/60">{compare.cols[1]}</th>
                  </tr>
                </thead>
                <tbody>
                  {compare.rows.map((r, i) => (
                    <tr key={i} className={i % 2 ? "bg-cream" : "bg-sand"}>
                      <td className="p-3 text-right text-ink/80">{r[0]}</td>
                      <td className="p-3 text-center font-medium text-teal-dark">
                        <span className="inline-flex items-center justify-center gap-1">
                          <IcCircleCheck className="h-4 w-4 text-teal" /> {r[1]}
                        </span>
                      </td>
                      <td className="p-3 text-center text-ink/50">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        )}

        {/* REVIEWS — REMOVED.
            This section rendered CATEGORY_REVIEWS: invented customers with
            invented names ("م. ع") and invented quotes ("تجربة رائعة، وصل
            بسرعة"), five filled stars each, under the heading "آراء العملاء".
            None of it was real. A shipped badge even read "نماذج — استبدلها
            بمراجعات حقيقية", which is a developer note, not a disclosure — the
            visitor still reads fabricated praise from people who never bought
            anything.
            When real reviews exist, render them from real data. Until then,
            nothing. */}

        {/* FAQ */}
        {faqs.length > 0 && (
          <Reveal as="section" className="mt-16">
            <h2 className="mb-5 font-display text-xl text-teal-dark">أسئلة شائعة</h2>
            <div className="space-y-3">
              {faqs.map(([q, a], i) => (
                <details key={i} className="group rounded-xl border border-line bg-cream p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-display text-ink">
                    <span>{q}</span>
                    <IcChevron className="h-4 w-4 text-teal transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink/75">{a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        )}

        {/* SHARE */}
        <ShareRow
          title={p.title_ar}
          label="شارك المنتج:"
          fallbackText="منتج من متجر أسنانك"
        />

        {/* GUARANTEE / RISK REVERSAL */}
        <Reveal as="section" className="mt-16 rounded-3xl bg-gradient-to-br from-teal-dark to-teal px-8 py-12 text-center text-cream">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-cream/10 ring-1 ring-cream/20">
            <IcShield className="h-8 w-8" />
          </div>
          <h2 className="font-display text-2xl">اطلبها بثقة تامة</h2>
          <p className="mx-auto mt-3 max-w-md text-cream/85">
            دفع آمن 100٪ عبر Stripe، وإمكانية الاسترجاع خلال 14 يومًا. رضاك التام هو أولويتنا —
            وإن لم يعجبك المنتج، نحن هنا من أجلك.
          </p>
          <div className="mt-6">
            <BuyButton {...buyProps} big showAddToCart={false} className="mx-auto max-w-xs" />
          </div>
          <p className="mx-auto mt-4 flex max-w-md items-center justify-center gap-1.5 text-xs text-cream/55">
            <IcInfo className="h-3.5 w-3.5" /> للعناية المثلى بصحة فمك، ننصح دائمًا باستشارة طبيب الأسنان.
          </p>
        </Reveal>

        {/* RELATED PRODUCTS — same category */}
        {related.length > 0 && (
          <Reveal as="section" className="mt-16">
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="font-display text-xl text-teal-dark">منتجات مشابهة</h2>
              <Link href={`/shop/${cat.slug}/`} className="text-sm text-teal hover:underline">
                عرض كل {cat.title_ar}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((rp) => <MiniProductCard key={rp.slug} p={rp} currency={currency} />)}
            </div>
          </Reveal>
        )}

        {/* SIMILAR PRODUCTS — cross-category complements */}
        {similar.length > 0 && (
          <Reveal as="section" className="mt-14">
            <div className="mb-5">
              <h2 className="font-display text-xl text-teal-dark">قد يعجبك أيضًا</h2>
              <p className="mt-1 text-sm text-ink/60">اختيارات تكمل روتين عنايتك.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {similar.map((sp) => <MiniProductCard key={sp.slug} p={sp} currency={currency} />)}
            </div>
          </Reveal>
        )}

        {/* READ MORE — articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-14 border-t border-line pt-6">
            <h2 className="font-display text-lg text-teal-dark">اقرأ أكثر</h2>
            <ul className="mt-3 space-y-2">
              {relatedArticles.map((a) => (
                <li key={a.slug}>
                  <Link href={`/maqalat/${a.slug}/`} className="inline-flex items-center gap-2 text-teal hover:underline">
                    <IcChevron className="h-4 w-4 -rotate-90" />
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* STICKY MOBILE BUY BAR */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 p-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="shrink-0">
            <div className="font-display text-lg font-bold text-teal-dark">{p.price} {currency}</div>
            {p.compare_at_price && (
              <div className="text-xs text-ink/40 line-through">{p.compare_at_price} {currency}</div>
            )}
          </div>
          <BuyButton {...buyProps} block showAddToCart={false} className="flex-1" />
        </div>
      </div>
      <StickyBuyBar
        product={productLite}
        price={p.price}
        currency={currency}
        buyable={buyable}
        title={p.title_ar}
      />
    </article>
  );
}
