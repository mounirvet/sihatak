import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGlossaryTerm, getGlossarySlugs, GLOSSARY } from '../../../lib/glossary';
import { getAllArticles } from '../../../lib/content';
import { TOOL_CATEGORIES } from '../../../lib/tools';
import { SITE, PILLARS } from '../../../lib/site';

export function generateStaticParams() {
  return getGlossarySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const t = getGlossaryTerm(params.slug);
  if (!t) return {};
  const desc = t.quickAnswer || (t.definition.split('.')[0] + '.');
  return {
    title: `${t.term} — ما هو؟ التعريف والمعنى`,
    description: desc,
    alternates: { canonical: `/mustalahat/${params.slug}/` },
    openGraph: { title: `${t.term} — التعريف`, description: desc, type: 'article' },
  };
}

function TermSchema({ t }) {
  const pageUrl = `${SITE.url}/mustalahat/${t.slug}/`;
  // alternateName carries every name the entity is known by (Arabic synonyms + English),
  // helping search engines + AI connect this entity across languages and phrasings.
  const altNames = Array.from(new Set([t.termEn, ...(t.alternateName || [])].filter(Boolean)));
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${pageUrl}#term`,
    name: t.term,
    alternateName: altNames,
    description: t.definition,
    url: pageUrl,
    inDefinedTermSet: `${SITE.url}/mustalahat/#glossary`,
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

// FAQPage schema built from the term's quick answer — the "ما هو X؟" Q&A that
// AI answer-engines and Google's FAQ rich results extract.
function TermFaqSchema({ t }) {
  if (!t.quickAnswer) return null;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `ما هو ${t.term}؟`,
        acceptedAnswer: { '@type': 'Answer', text: t.quickAnswer },
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

function BreadcrumbSchema({ t }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: 'المصطلحات', item: `${SITE.url}/mustalahat/` },
      { '@type': 'ListItem', position: 3, name: t.term, item: `${SITE.url}/mustalahat/${t.slug}/` },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

export default async function GlossaryTermPage({ params }) {
  const t = getGlossaryTerm(params.slug);
  if (!t) notFound();

  const pillar = PILLARS.find((p) => p.slug === t.pillar);
  const allArticles = await getAllArticles();

  const related = (t.relatedArticles || [])
    .map((slug) => allArticles.find((a) => a.slug === slug))
    .filter(Boolean);

  const relatedTerms = (t.relatedTerms || [])
    .map((slug) => GLOSSARY.find((g) => g.slug === slug))
    .filter(Boolean);

  // related product categories: any /adawat/ category that lists this term in relatedTerms
  const relatedTools = (TOOL_CATEGORIES || []).filter((c) =>
    (c.relatedTerms || []).includes(t.slug)
  );

  return (
    <div className="bg-sand">
      <TermSchema t={t} />
      <TermFaqSchema t={t} />
      <BreadcrumbSchema t={t} />
      <div className="max-w-prose mx-auto px-5 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-ink/50 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-teal">الرئيسية</Link>
          <span>/</span>
          <Link href="/mustalahat/" className="hover:text-teal">المصطلحات</Link>
          <span>/</span>
          <span className="text-ink/70">{t.term}</span>
        </nav>

        {/* Term + English name + pronunciation */}
        <h1 className="text-3xl md:text-4xl font-display font-bold text-ink leading-tight mb-1">
          {t.term}
        </h1>
        <div className="flex items-center gap-3 flex-wrap mb-4">
          {t.termEn && <span className="text-ink/45 text-lg" dir="ltr">{t.termEn}</span>}
          {t.pronunciation && (
            <span className="text-ink/40 text-sm" dir="ltr">/ {t.pronunciation} /</span>
          )}
        </div>

        {/* Synonyms / alternate names */}
        {t.alternateName && t.alternateName.length > 0 && (
          <div className="mb-6">
            <span className="text-sm text-ink/50 ml-2">يُعرف أيضاً بـ:</span>
            <span className="inline-flex flex-wrap gap-2 align-middle">
              {t.alternateName.map((s) => (
                <span key={s} className="text-sm text-ink/70 bg-sand border border-line rounded-full px-3 py-0.5">
                  {s}
                </span>
              ))}
            </span>
          </div>
        )}

        {/* Quick answer — the TL;DR the answer-engines pull */}
        {t.quickAnswer && (
          <div className="bg-cream border border-teal/30 rounded-lg p-4 mb-6">
            <div className="text-xs text-teal-dark font-display mb-1">الإجابة المختصرة</div>
            <p className="text-ink text-lg leading-relaxed">{t.quickAnswer}</p>
          </div>
        )}

        {/* Optional diagram (only if a term provides one) */}
        {t.image && (
          <figure className="mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={t.image}
              alt={t.imageAlt || t.term}
              className="w-full rounded-xl border border-line"
              loading="lazy"
            />
            {t.imageAlt && (
              <figcaption className="text-xs text-ink/45 mt-2 text-center">{t.imageAlt}</figcaption>
            )}
          </figure>
        )}

        {/* Full definition */}
        <div className="bg-mint/40 border-r-4 border-teal rounded-lg p-5 mb-8">
          <p className="text-ink text-lg leading-relaxed">{t.definition}</p>
        </div>

        {/* Related articles — deep dive */}
        {related.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-display text-ink mb-3">مقالات تشرح {t.term} بالتفصيل</h2>
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

        {/* Related terms — entity graph */}
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

        {/* Related tools/products — education → commercial bridge (contextual, not spammy) */}
        {relatedTools.length > 0 && (
          <div className="mb-8 bg-cream border border-line rounded-xl p-5">
            <h2 className="text-base font-display text-ink mb-2">أدوات قد تهمّك</h2>
            <div className="flex flex-wrap gap-2">
              {relatedTools.map((c) => (
                <Link
                  key={c.slug}
                  href={`/adawat/${c.slug}/`}
                  className="text-sm text-teal border border-teal/30 rounded-full px-4 py-1.5 hover:bg-teal hover:text-cream transition-colors"
                >
                  {c.title}
                </Link>
              ))}
            </div>
            <p className="text-xs text-ink/40 mt-3">
              صفحات إرشادية لاختيار الأدوات؛ المحتوى تثقيفي ولا يُغني عن استشارة طبيب الأسنان.
            </p>
          </div>
        )}

        {/* Link to pillar */}
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
