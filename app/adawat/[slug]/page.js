import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToolCategory, getToolSlugs, TOOL_CATEGORIES } from '../../../lib/tools';
import { getAllArticles } from '../../../lib/content';
import { GLOSSARY } from '../../../lib/glossary';
import { SITE, PILLARS } from '../../../lib/site';
import AffiliateDisclosure from '../../../components/AffiliateDisclosure';

export function generateStaticParams() {
  return getToolSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const c = getToolCategory(params.slug);
  if (!c) return {};
  return {
    title: `${c.title} — كيف تختار + مقارنة وتوصيات | أسنانك`,
    description: c.intro.slice(0, 155),
    alternates: { canonical: `/adawat/${params.slug}/` },
  };
}

// Honest ItemList — NOT Review/AggregateRating. Plus FAQ schema from howToChoose-derived Q&A.
function CategorySchema({ c }) {
  const pageUrl = `${SITE.url}/adawat/${c.slug}/`;
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: c.title,
    url: pageUrl,
    itemListElement: c.products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `${SITE.url}/adawat/muntaj/${p.slug}/`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
    />
  );
}

// Collect the union of spec labels across products for the comparison table columns.
function specColumns(products) {
  const seen = [];
  products.forEach((p) =>
    (p.specs || []).forEach((s) => {
      if (!seen.includes(s.label)) seen.push(s.label);
    })
  );
  return seen.slice(0, 5); // keep table readable
}
function specValue(p, label) {
  const hit = (p.specs || []).find((s) => s.label === label);
  return hit ? hit.value : '—';
}

export default async function ToolCategoryPage({ params }) {
  const c = getToolCategory(params.slug);
  if (!c) notFound();

  const pillar = PILLARS.find((p) => p.slug === c.pillar);
  const allArticles = await getAllArticles();
  const related = (c.relatedArticles || [])
    .map((slug) => allArticles.find((a) => a.slug === slug))
    .filter(Boolean);
  const relatedTerms = (c.relatedTerms || [])
    .map((slug) => GLOSSARY.find((g) => g.slug === slug))
    .filter(Boolean);

  const realProducts = c.products.filter((p) => !p.name.includes('PLACEHOLDER'));
  const cols = specColumns(realProducts.length ? realProducts : c.products);

  // Decision helper: gather distinct bestFor tags -> product(s)
  const tagMap = {};
  (realProducts.length ? realProducts : c.products).forEach((p) => {
    (p.bestFor || []).forEach((t) => {
      if (t.includes('PLACEHOLDER')) return;
      (tagMap[t] = tagMap[t] || []).push(p);
    });
  });
  const decisionTags = Object.keys(tagMap).slice(0, 8);

  return (
    <div className="bg-sand">
      <CategorySchema c={c} />
      <div className="max-w-prose mx-auto px-5 py-12">
        <nav className="text-sm text-ink/50 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-teal">الرئيسية</Link>
          <span>/</span>
          <Link href="/adawat/" className="hover:text-teal">الأدوات</Link>
          <span>/</span>
          <span className="text-ink/70">{c.title}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-ink leading-tight mb-4">
          {c.title}
        </h1>

        <AffiliateDisclosure />

        {/* Honest trust band — our differentiator is honesty, surfaced */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
          <div className="bg-mint/40 rounded-lg p-3 text-center">
            <div className="text-sm font-display text-teal-dark">محايد بين الماركات</div>
            <div className="text-xs text-ink/60 mt-1">معايير لا إعلانات</div>
          </div>
          <div className="bg-mint/40 rounded-lg p-3 text-center">
            <div className="text-sm font-display text-teal-dark">نذكر الحدود بصراحة</div>
            <div className="text-xs text-ink/60 mt-1">لا وعود مبالغ فيها</div>
          </div>
          <div className="bg-mint/40 rounded-lg p-3 text-center">
            <div className="text-sm font-display text-teal-dark">مراجَع طبياً</div>
            <div className="text-xs text-ink/60 mt-1">واستشر طبيبك دائماً</div>
          </div>
        </div>

        {/* Intro / educational framing */}
        <p className="text-ink/80 text-lg leading-relaxed mb-8">{c.intro}</p>

        {/* How to choose */}
        <div className="mb-10">
          <h2 className="text-xl font-display text-ink mb-3">كيف تختار؟</h2>
          <ul className="space-y-2 text-ink/80 leading-relaxed list-disc pr-5">
            {c.howToChoose.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Decision helper — "which is right for you?" */}
        {decisionTags.length > 0 && (
          <div className="mb-10 bg-cream border border-line rounded-xl p-5">
            <h2 className="text-xl font-display text-ink mb-1">أيّها يناسبك؟</h2>
            <p className="text-sm text-ink/60 mb-4">اختر ما يصفك لترى الأنسب لحالتك:</p>
            <div className="space-y-3">
              {decisionTags.map((tag) => (
                <div key={tag} className="flex items-start gap-3 flex-wrap">
                  <span className="text-sm text-teal-dark bg-mint rounded-full px-3 py-1 shrink-0">
                    {tag}
                  </span>
                  <span className="text-sm text-ink/70">
                    {tagMap[tag].map((p, idx) => (
                      <span key={p.slug}>
                        {idx > 0 && '، '}
                        <Link href={`/adawat/muntaj/${p.slug}/`} className="text-teal hover:underline">
                          {p.name}
                        </Link>
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink/45 mt-4">
              اقتراحات إرشادية بحسب معايير الاختيار، لا تشخيص. لحالتك الخاصة استشر طبيب الأسنان.
            </p>
          </div>
        )}

        {/* Comparison table */}
        {realProducts.length > 1 && cols.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-display text-ink mb-3">مقارنة سريعة</h2>
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-teal/30">
                    <th className="text-right py-2 pl-3 font-display text-ink">المنتج</th>
                    {cols.map((col) => (
                      <th key={col} className="text-right py-2 px-3 font-display text-ink/80 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {realProducts.map((p) => (
                    <tr key={p.slug} className="border-b border-line">
                      <td className="py-2 pl-3">
                        <Link href={`/adawat/muntaj/${p.slug}/`} className="text-teal hover:underline">
                          {p.name}
                        </Link>
                      </td>
                      {cols.map((col) => (
                        <td key={col} className="py-2 px-3 text-ink/70 whitespace-nowrap">
                          {specValue(p, col)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-ink/45 mt-2">
              المواصفات للمقارنة الإرشادية؛ راجع تفاصيل كل منتج وتأكّد منها قبل الشراء.
            </p>
          </div>
        )}

        {/* Recommended products — richer cards */}
        <div className="mb-10">
          <h2 className="text-xl font-display text-ink mb-4">منتجات نوصي بها</h2>
          <div className="space-y-4">
            {c.products.map((p, i) => (
              <div key={i} className="bg-cream border border-line rounded-xl p-5 shadow-card">
                <h3 className="font-display text-lg text-ink mb-1">{p.name}</h3>
                {p.why && <p className="text-sm text-ink/70 leading-relaxed mb-3">{p.why}</p>}
                {/* top features on the card */}
                {p.features && p.features.length > 0 && !p.features[0].includes('PLACEHOLDER') && (
                  <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                    {p.features.slice(0, 3).map((f, fi) => (
                      <li key={fi} className="text-xs text-ink/60 flex items-center gap-1">
                        <span className="text-teal">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                {/* bestFor chips */}
                {p.bestFor && p.bestFor.length > 0 && !p.bestFor[0].includes('PLACEHOLDER') && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.bestFor.map((t, ti) => (
                      <span key={ti} className="text-xs text-teal-dark bg-mint/60 rounded-full px-2.5 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <Link
                  href={`/adawat/muntaj/${p.slug}/`}
                  className="inline-block bg-teal text-cream rounded-full px-5 py-2 text-sm hover:bg-teal-dark transition-colors"
                >
                  عرض المنتج
                </Link>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink/45 mt-3">
            الروابط قد تكون روابط شراكة. اختيارنا مبني على معايير الاختيار الموضّحة، وننصح دائماً
            باستشارة طبيب الأسنان.
          </p>
        </div>

        {/* Related educational articles */}
        {related.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-display text-ink mb-3">مقالات ذات صلة</h2>
            <ul className="space-y-2">
              {related.map((a) => (
                <li key={a.slug}>
                  <Link href={`/maqalat/${a.slug}/`} className="text-teal hover:underline">
                    {a.meta.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Related glossary terms */}
        {relatedTerms.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-display text-ink mb-3">مصطلحات ذات صلة</h2>
            <div className="flex flex-wrap gap-2">
              {relatedTerms.map((rt) => (
                <Link
                  key={rt.slug}
                  href={`/mustalahat/${rt.slug}/`}
                  className="text-sm text-teal-dark bg-mint rounded-full px-3 py-1 hover:bg-teal hover:text-cream transition-colors"
                >
                  {rt.term}
                </Link>
              ))}
            </div>
          </div>
        )}

        {pillar && (
          <div className="mt-10 text-sm">
            <Link href={`/mahawir/${pillar.slug}/`} className="text-teal hover:underline">
              ← تصفّح محور: {pillar.title}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
