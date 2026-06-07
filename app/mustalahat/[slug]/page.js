import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGlossaryTerm, getGlossarySlugs, GLOSSARY } from '../../../lib/glossary';
import { getAllArticles } from '../../../lib/content';
import { SITE, PILLARS } from '../../../lib/site';

export function generateStaticParams() {
  return getGlossarySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const t = getGlossaryTerm(params.slug);
  if (!t) return {};
  const firstSentence = t.definition.split('.')[0] + '.';
  return {
    title: `${t.term} — ما هو؟ التعريف والمعنى`,
    description: firstSentence,
    alternates: { canonical: `/mustalahat/${params.slug}/` },
    openGraph: { title: `${t.term} — التعريف`, description: firstSentence, type: 'article' },
  };
}

function TermSchema({ t }) {
  const pageUrl = `${SITE.url}/mustalahat/${t.slug}/`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${pageUrl}#term`,
    name: t.term,
    alternateName: t.termEn,
    description: t.definition,
    url: pageUrl,
    inDefinedTermSet: `${SITE.url}/mustalahat/#glossary`,
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

  // resolve related articles (only ones that exist)
  const related = (t.relatedArticles || [])
    .map((slug) => allArticles.find((a) => a.slug === slug))
    .filter(Boolean);

  // resolve related terms
  const relatedTerms = (t.relatedTerms || [])
    .map((slug) => GLOSSARY.find((g) => g.slug === slug))
    .filter(Boolean);

  return (
    <div className="bg-sand">
      <TermSchema t={t} />
      <div className="max-w-prose mx-auto px-5 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-ink/50 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-teal">الرئيسية</Link>
          <span>/</span>
          <Link href="/mustalahat/" className="hover:text-teal">المصطلحات</Link>
          <span>/</span>
          <span className="text-ink/70">{t.term}</span>
        </nav>

        {/* Term + English name */}
        <h1 className="text-3xl md:text-4xl font-display font-bold text-ink leading-tight mb-1">
          {t.term}
        </h1>
        {t.termEn && <p className="text-ink/45 text-lg mb-6" dir="ltr">{t.termEn}</p>}

        {/* Answer-first definition — the AI-citable block */}
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
