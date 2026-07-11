// app/shop/[category]/[slug]/page.jsx — enhanced conversion product page.
// Static-export safe. Buy button links to the Stripe-hosted Payment Link.
// Conversion patterns adapted (honestly, YMYL-safe) from high-converting landers:
// price anchoring, trust badges, benefit stacking, guarantee band, sticky buy bar.

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "../../../../lib/storeCategories.js";
import { getArticleMeta } from "../../../../lib/content.js";
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

const CATEGORY_BENEFITS = {
  "electric-brushes": [
    ["🪥", "تنظيف أعمق", "اهتزاز صوتي يصل لما بين الأسنان وخط اللثة."],
    ["⏱️", "مؤقّت ذكي", "يساعدك على الالتزام بمدّة التنظيف الموصى بها."],
    ["🔋", "شحن يدوم", "بطارية قابلة للشحن تكفي أيامًا من الاستخدام."],
  ],
  "interdental-care": [
    ["💧", "تنظيف بالنفث المائي", "يصل لما تصعب على الفرشاة والخيط العادي."],
    ["🦷", "لطيف على اللثة", "درجات ضغط قابلة للتعديل تناسب الجميع."],
    ["✈️", "مناسب للسفر", "تصميم لاسلكي محمول ومقاوم للماء."],
  ],
  whitening: [
    ["✨", "تفتيح تدريجي", "روتين منزلي بسيط لنتيجة ملحوظة."],
    ["😬", "لطيف على الأسنان", "تركيبة تركّز على تقليل الحساسية."],
    ["🏠", "من المنزل", "دون الحاجة لموعد في العيادة."],
  ],
  accessories: [
    ["☀️", "تعقيم فعّال", "أشعة UV-C للحفاظ على نظافة الفرشاة."],
    ["🔌", "شحن USB-C", "عملي ويكفي لأيام من الاستخدام."],
    ["📦", "تصميم عملي", "محمول أو قابل للتثبيت دون ثقب."],
  ],
};

// Honest, factual comparison rows per category (NO efficacy/medical claims).
// [attribute, this-product, the-common-alternative]
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

// Factual FAQs per category (answer buyer objections; always dentist-referring).
const CATEGORY_FAQ = {
  "interdental-care": [
    ["هل يغني الخيط المائي عن الخيط العادي؟",
      "يعتبره كثير من أطباء الأسنان وسيلة مكمّلة فعّالة، وقد يكون بديلاً عمليًا لمن يجد صعوبة في الخيط العادي. استشر طبيبك لتحديد الأنسب لحالتك."],
    ["كم مرة يُستخدم؟",
      "يُستخدم عادةً مرة يوميًا ضمن روتين العناية، أو حسب توجيه طبيب الأسنان."],
    ["هل يناسب من يرتدون التقويم؟",
      "نعم، وغالبًا يُرفق رأس مخصص لذلك. اتبع إرشادات المصنّع وطبيبك."],
  ],
  "electric-brushes": [
    ["متى أستبدل رأس الفرشاة؟",
      "يُنصح عمومًا بالاستبدال كل ثلاثة أشهر تقريبًا أو عند تآكل الشعيرات، حسب إرشادات المصنّع."],
    ["هل تناسب الأسنان الحساسة؟",
      "كثير من الطُرز توفّر وضعًا لطيفًا للأسنان الحساسة. استشر طبيبك إن كانت لديك حساسية مستمرة."],
  ],
  whitening: [
    ["هل التبييض المنزلي آمن؟",
      "قد يكون مناسبًا لكثير من الأشخاص عند اتباع الإرشادات، لكن يُنصح باستشارة طبيب الأسنان قبل البدء، خاصةً مع وجود حساسية أو مشاكل في اللثة."],
    ["كم تدوم النتيجة؟",
      "تختلف المدة حسب العادات الغذائية والعناية. للحفاظ على النتيجة يساعد تقليل المشروبات الملوّنة والعناية المنتظمة."],
  ],
};

function BenefitIcon({ emoji }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mint text-xl">
      {emoji}
    </span>
  );
}

export default function ProductPage({ params }) {
  const p = getProductBySlug(params.slug);
  if (!p || p.category !== params.category) notFound();

  const cat = getCategoryBySlug(p.category);
  const buyable = isBuyable(p);
  const currency = SHOP_CURRENCY_SYMBOL_AR;

  const benefits =
    (Array.isArray(p.benefits) && p.benefits.length
      ? p.benefits.map((b) => (Array.isArray(b) ? b : [b.icon, b.title, b.text]))
      : CATEGORY_BENEFITS[p.category]) || [];

  const compare = p.compare_table || CATEGORY_COMPARE[p.category] || null;  const faqs =
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

  const BuyButton = ({ className = "" }) =>
    buyable ? (
      <a
        href={p.stripe_payment_link}
        className={`block rounded-xl bg-coral px-6 py-4 text-center text-lg font-bold text-white shadow-card transition hover:brightness-95 ${className}`}
      >
        اشترِ الآن — {p.price} {currency}
      </a>
    ) : (
      <button
        disabled
        className={`block w-full cursor-not-allowed rounded-xl bg-ink/20 px-6 py-4 text-center font-medium text-ink/50 ${className}`}
      >
        {p.in_stock ? "غير متاح حاليًا" : "نفدت الكمية"}
      </button>
    );

  return (
    <article dir="rtl" className="bg-sand pb-24 md:pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map(([q, a]) => ({
                "@type": "Question",
                name: q,
                acceptedAnswer: { "@type": "Answer", text: a },
              })),
            }),
          }}
        />
      )}

      <div className="mx-auto max-w-5xl px-4 py-6">
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-ink/50">
          <Link href="/" className="hover:text-teal">الرئيسية</Link>
          <span>/</span>
          <Link href="/shop/" className="hover:text-teal">المتجر</Link>
          <span>/</span>
          <Link href={`/shop/${cat.slug}/`} className="hover:text-teal">{cat.title_ar}</Link>
          <span>/</span>
          <span className="text-ink/70">{p.title_ar}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-cream shadow-card">
            {p.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.images[0]} alt={p.title_ar} className="h-full w-full object-cover" />
            ) : (
              <div className="flex aspect-square items-center justify-center text-6xl text-teal/20">🦷</div>
            )}
          </div>

          <div>
            {savePct && (
              <span className="mb-3 inline-block rounded-full bg-coral/15 px-3 py-1 text-sm font-bold text-coral">
                خصم {savePct}٪ لفترة محدودة
              </span>
            )}

            <h1 className="font-display text-2xl font-bold leading-tight text-ink md:text-3xl">
              {p.title_ar}
            </h1>

            <div className="mt-4 flex items-end gap-3">
              <span className="font-display text-3xl font-bold text-teal-dark">
                {p.price} {currency}
              </span>
              {p.compare_at_price && (
                <span className="mb-1 text-lg text-ink/40 line-through">
                  {p.compare_at_price} {currency}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-ink/50">شامل الضريبة · الدفع الآمن عبر Stripe</p>

            {p.shipping_days_min && p.shipping_days_max && (
              <div className="mt-5 rounded-xl border border-mint bg-mint/30 p-4 text-sm text-teal-dark">
                🚚 الشحن إلى دول الخليج · مدة التوصيل التقديرية {p.shipping_days_min}–{p.shipping_days_max} يوم عمل
              </div>
            )}

            <div className="mt-5 hidden md:block">
              <BuyButton />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-ink/60">
              <div className="rounded-lg border border-line bg-cream p-2">🔒<br />دفع آمن</div>
              <div className="rounded-lg border border-line bg-cream p-2">↩️<br />استرجاع 14 يوم</div>
              <div className="rounded-lg border border-line bg-cream p-2">✅<br />منتج أصلي</div>
            </div>

            <p className="mt-3 text-xs text-ink/50">
              <Link href="/shop/al-shahn/" className="text-teal hover:underline">الشحن</Link>
              {" · "}
              <Link href="/shop/al-istirja/" className="text-teal hover:underline">الاسترجاع</Link>
            </p>
          </div>
        </div>

        {benefits.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 font-display text-xl text-teal-dark">لماذا هذا المنتج؟</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {benefits.map((b, i) => (
                <div key={i} className="flex gap-3 rounded-xl border border-line bg-cream p-4">
                  <BenefitIcon emoji={b[0]} />
                  <div>
                    <div className="font-display text-ink">{b[1]}</div>
                    <div className="mt-1 text-sm text-ink/70">{b[2]}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {p.body_md && (
          <section className="mt-12">
            <h2 className="mb-4 font-display text-xl text-teal-dark">تفاصيل المنتج</h2>
            <div className="prose-ar max-w-none text-ink/85">
              {p.body_md.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* COMPARE TABLE */}
        {compare && compare.rows && compare.rows.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 font-display text-xl text-teal-dark">مقارنة سريعة</h2>
            <div className="overflow-hidden rounded-2xl border border-line">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-mint/40 text-teal-dark">
                    <th className="p-3 text-right font-display font-normal"></th>
                    <th className="p-3 text-center font-display font-bold">{compare.cols[0]}</th>
                    <th className="p-3 text-center font-display font-normal text-ink/60">{compare.cols[1]}</th>
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

        {/* FAQ ACCORDION */}
        {faqs.length > 0 && (
          <section className="mt-12">
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

        <section className="mt-12 rounded-2xl bg-teal-dark p-6 text-center text-cream">
          <div className="text-3xl">🛡️</div>
          <h2 className="mt-2 font-display text-xl">تسوّق بثقة</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-cream/80">
            دفع آمن عبر Stripe، وإمكانية الاسترجاع خلال 14 يومًا وفق سياستنا. رضاك أولويتنا.
          </p>
          <p className="mx-auto mt-3 max-w-md text-xs text-cream/60">
            هذا المنتج للعناية بالأسنان ولا يغني عن استشارة طبيب الأسنان.
          </p>
        </section>

        {relatedArticles.length > 0 && (
          <section className="mt-12 border-t border-line pt-6">
            <h2 className="font-display text-lg text-teal-dark">مقالات ذات صلة</h2>
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
