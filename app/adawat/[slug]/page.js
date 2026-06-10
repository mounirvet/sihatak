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
    title: `${c.title} — كيف تختار + توصيات | أسنانك`,
    description: c.intro.slice(0, 155),
    alternates: { canonical: `/adawat/${params.slug}/` },
  };
}

// Honest ItemList of recommended products — NOT Review/AggregateRating.
function CategorySchema({ c }) {
  const pageUrl = `${SITE.url}/adawat/${c.slug}/`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: c.title,
    url: pageUrl,
    itemListElement: c.products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
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

        {/* Intro / educational framing */}
        <p className="text-ink/80 text-lg leading-relaxed mb-8">{c.intro}</p>

        {/* How to choose — the trust-earning value before any product */}
        <div className="mb-10">
          <h2 className="text-xl font-display text-ink mb-3">كيف تختار؟</h2>
          <ul className="space-y-2 text-ink/80 leading-relaxed list-disc pr-5">
            {c.howToChoose.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Recommended products */}
        <div className="mb-10">
          <h2 className="text-xl font-display text-ink mb-4">منتجات نوصي بها</h2>
          <div className="space-y-4">
            {c.products.map((p, i) => (
              <div key={i} className="bg-cream border border-line rounded-xl p-5 shadow-card">
                <h3 className="font-display text-lg text-ink mb-1">{p.name}</h3>
                {p.why && <p className="text-sm text-ink/70 leading-relaxed mb-3">{p.why}</p>}
                <div className="flex items-center gap-3 flex-wrap">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                    className="inline-block bg-teal text-cream rounded-full px-5 py-2 text-sm hover:bg-teal-dark transition-colors"
                  >
                    عرض المنتج
                  </a>
                  {p.priceNote && <span className="text-xs text-ink/50">{p.priceNote}</span>}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink/45 mt-3">
            الروابط أعلاه قد تكون روابط شراكة. اختيارنا مبني على معايير الاختيار الموضّحة، وننصح
            دائماً باستشارة طبيب الأسنان.
          </p>
        </div>

        {/* Related educational articles — trust content feeds commerce, not the reverse */}
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
