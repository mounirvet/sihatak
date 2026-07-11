// app/shop/[category]/[slug]/page.jsx — PREMIUM conversion product page.
// Benefit-first, aspirational, confident. Real claims featured boldly; the single
// dentist note is a trust signal, not a disclaimer on every line.

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "../../../../lib/storeCategories.js";
import { getArticleMeta } from "../../../../lib/content.js";
import { getSellCopy } from "../../../../lib/shopCopy.js";
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
  return {
    title: `${p.title_ar} | متجر أسنانك`,
    description: p.short_desc,
    alternates: { canonical: `/shop/${p.category}/${p.slug}/` },
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

function BenefitIcon({ emoji }) {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-mint text-2xl">
      {emoji}
    </span>
  );
}

function Stars() {
  return <span className="text-coral" aria-hidden="true">★★★★★</span>;
}

export default function ProductPage({ params }) {
  const p = getProductBySlug(params.slug);
  if (!p || p.category !== params.category) notFound();

  const cat = getCategoryBySlug(p.category);
  const buyable = isBuyable(p);
  const currency = SHOP_CURRENCY_SYMBOL_AR;
  const sell = getSellCopy(p);

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

  const BuyButton = ({ className = "", big = false }) =>
    buyable ? (
      <a
        href={p.stripe_payment_link}
        className={`block rounded-xl bg-coral text-center font-bold text-white shadow-card transition hover:brightness-95 ${big ? "px-6 py-4 text-lg" : "px-6 py-4"} ${className}`}
      >
        اطلبها الآن — {p.price} {currency}
      </a>
    ) : (
      <button
        disabled
        className={`block w-full cursor-not-allowed rounded-xl bg-ink/15 px-6 py-4 text-center font-medium text-ink/50 ${className}`}
      >
        {p.in_stock ? "غير متاح حاليًا" : "نفدت الكمية"}
      </button>
    );

  return (
    <article dir="rtl" className="bg-sand pb-24 md:pb-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
          <div className="relative overflow-hidden rounded-2xl bg-cream shadow-card">
            {savePct && (
              <span className="absolute right-4 top-4 z-10 rounded-full bg-coral px-3 py-1 text-sm font-bold text-white shadow">
                وفّر {savePct}٪
              </span>
            )}
            {p.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.images[0]} alt={p.title_ar} className="h-full w-full object-cover" />
            ) : (
              <div className="flex aspect-square items-center justify-center text-6xl text-teal/20">🦷</div>
            )}
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold leading-tight text-ink md:text-3xl">
              {p.title_ar}
            </h1>
            {sell.tagline && (
              <p className="mt-2 text-lg font-display text-teal">{sell.tagline}</p>
            )}

            <div className="mt-3 flex items-center gap-2 text-sm text-ink/60">
              <Stars /> <span>تقييمات عملائنا</span>
            </div>

            {sell.heroClaim && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-dark px-4 py-2 text-sm font-bold text-cream">
                <span aria-hidden="true">✦</span> {sell.heroClaim}
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
            <p className="mt-1 text-xs text-ink/50">شامل الضريبة · دفع آمن عبر Stripe</p>

            {p.shipping_days_min && (
              <div className="mt-5 rounded-xl border border-mint bg-mint/30 p-4 text-sm text-teal-dark">
                🚚 اطلبها اليوم — شحن إلى دول الخليج خلال {p.shipping_days_min}–{p.shipping_days_max} يوم عمل
              </div>
            )}

            <div className="mt-5 hidden md:block">
              <BuyButton big />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-ink/60">
              <div className="rounded-lg border border-line bg-cream p-2">🔒<br />دفع آمن</div>
              <div className="rounded-lg border border-line bg-cream p-2">↩️<br />استرجاع خلال 14 يوم</div>
              <div className="rounded-lg border border-line bg-cream p-2">✅<br />منتج أصلي</div>
            </div>
          </div>
        </div>

        {/* WHY YOU'LL LOVE IT */}
        {sell.sellBenefits.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-center font-display text-2xl text-teal-dark">لماذا ستحبّه</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {sell.sellBenefits.map((b, i) => (
                <div key={i} className="rounded-2xl border border-line bg-cream p-5 text-center">
                  <div className="mx-auto mb-3 flex justify-center"><BenefitIcon emoji={b[0]} /></div>
                  <div className="font-display text-lg text-ink">{b[1]}</div>
                  <div className="mt-2 text-sm text-ink/70">{b[2]}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* DESCRIPTION */}
        {p.body_md && (
          <section className="mt-14">
            <h2 className="mb-4 font-display text-xl text-teal-dark">عن المنتج</h2>
            <div className="prose-ar max-w-none text-ink/85">
              {p.body_md.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
            </div>
          </section>
        )}

        {/* COMPARE */}
        {compare && compare.rows && (
          <section className="mt-14">
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
                      <td className="p-3 text-center font-medium text-teal-dark">✓ {r[1]}</td>
                      <td className="p-3 text-center text-ink/50">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* REVIEWS — starter samples, replace with real ones */}
        {sell.reviews.length > 0 && (
          <section className="mt-14">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl text-teal-dark">آراء العملاء</h2>
              <span className="rounded bg-mint/50 px-2 py-1 text-[10px] text-teal-dark">نماذج — استبدلها بمراجعات حقيقية</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {sell.reviews.map(([name, text], i) => (
                <div key={i} className="rounded-2xl border border-line bg-cream p-5">
                  <Stars />
                  <p className="mt-2 text-sm text-ink/80">"{text}"</p>
                  <p className="mt-3 text-xs font-medium text-ink/50">— {name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-5 font-display text-xl text-teal-dark">أسئلة شائعة</h2>
            <div className="space-y-3">
              {faqs.map(([q, a], i) => (
                <details key={i} className="group rounded-xl border border-line bg-cream p-4">
                  <summary className="flex cursor-pointer items-center justify-between font-display text-ink">
                    <span>{q}</span>
                    <span className="text-teal transition group-open:rotate-180">⌄</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink/75">{a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* RISK REVERSAL / GUARANTEE */}
        <section className="mt-14 rounded-2xl bg-teal-dark p-8 text-center text-cream">
          <div className="text-4xl">🛡️</div>
          <h2 className="mt-3 font-display text-2xl">اطلبها بثقة تامة</h2>
          <p className="mx-auto mt-3 max-w-md text-cream/85">
            دفع آمن 100٪ عبر Stripe، وإمكانية الاسترجاع خلال 14 يومًا. رضاك التام هو أولويتنا —
            وإن لم يعجبك المنتج، نحن هنا من أجلك.
          </p>
          <div className="mt-6">
            <BuyButton big className="mx-auto max-w-xs" />
          </div>
          <p className="mx-auto mt-4 max-w-md text-xs text-cream/55">
            للعناية المثلى بصحة فمك، ننصح دائمًا باستشارة طبيب الأسنان.
          </p>
        </section>

        {relatedArticles.length > 0 && (
          <section className="mt-12 border-t border-line pt-6">
            <h2 className="font-display text-lg text-teal-dark">اقرأ أكثر</h2>
            <ul className="mt-3 list-disc pr-5 text-teal">
              {relatedArticles.map((a) => (
                <li key={a.slug}>
                  <Link href={`/maqalat/${a.slug}/`} className="hover:underline">{a.title}</Link>
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
          <BuyButton className="flex-1" />
        </div>
      </div>
    </article>
  );
}
