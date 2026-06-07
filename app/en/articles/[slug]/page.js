import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEnArticle, getEnArticleSlugs } from '../../../../lib/contentEn';
import { SITE_EN, getPillarEn } from '../../../../lib/siteEn';

export function generateStaticParams() {
  return getEnArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const article = await getEnArticle(params.slug);
  if (!article) return {};
  const { meta } = article;
  const enUrl = `${SITE_EN.url}/en/articles/${params.slug}/`;
  const arUrl = meta.ar ? `${SITE_EN.url}/maqalat/${meta.ar}/` : null;
  const languages = { en: enUrl };
  if (arUrl) languages.ar = arUrl;
  return {
    title: meta.title,
    description: meta.excerpt,
    alternates: { canonical: enUrl, languages },
    openGraph: { title: meta.title, description: meta.excerpt, type: 'article' },
  };
}

function ArticleSchemaEn({ meta, slug }) {
  const url = `${SITE_EN.url}/en/articles/${slug}/`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: meta.title,
    description: meta.excerpt,
    inLanguage: 'en',
    datePublished: meta.date,
    dateModified: meta.updated || meta.date,
    lastReviewed: meta.updated || meta.date,
    url,
    publisher: { '@type': 'Organization', name: SITE_EN.name, url: SITE_EN.url },
  };
  const faqSchema = meta.faq && meta.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: meta.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
    </>
  );
}

export default async function EnArticlePage({ params }) {
  const article = await getEnArticle(params.slug);
  if (!article) notFound();
  const { slug, meta, contentHtml } = article;
  const pillar = getPillarEn(meta.pillar);

  return (
    <div className="bg-sand">
      <ArticleSchemaEn meta={meta} slug={slug} />
      <article className="max-w-prose mx-auto px-5 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-ink/50 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/en/" className="hover:text-teal">Home</Link>
          <span>/</span>
          <Link href="/en/articles/" className="hover:text-teal">Articles</Link>
          {pillar && (<><span>/</span><span className="text-ink/70">{pillar.title}</span></>)}
        </nav>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-ink leading-tight mb-4">
          {meta.title}
        </h1>

        {/* Reviewer + freshness */}
        <div className="flex items-center gap-2 text-sm text-ink/55 mb-6 pb-6 border-b border-line">
          <span className="text-teal">✓</span>
          <span>Medically reviewed · Last updated {meta.updated || meta.date}</span>
        </div>

        {/* Answer-first block */}
        {meta.answer && (
          <div className="bg-mint/40 border-l-4 border-teal rounded-lg p-5 mb-8">
            <p className="text-ink text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: meta.answer }} />
          </div>
        )}

        {/* Body */}
        <div className="prose-ar prose-en" dangerouslySetInnerHTML={{ __html: contentHtml }} />

        {/* FAQ */}
        {meta.faq && meta.faq.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-display text-ink mb-4">Frequently asked questions</h2>
            {meta.faq.map((f, i) => (
              <div key={i} className="border-b border-line py-4">
                <h3 className="font-medium text-ink mb-1">{f.q}</h3>
                <p className="text-ink/70 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        )}

        {/* Sources */}
        {meta.sources && meta.sources.length > 0 && (
          <div className="mt-8 text-sm text-ink/50">
            <h2 className="text-base font-display text-ink mb-2">Sources</h2>
            <ul className="space-y-1">
              {meta.sources.map((s, i) => (
                <li key={i}>{s.title} — {s.publisher}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Link to Arabic version */}
        {meta.ar && (
          <div className="mt-10 text-sm">
            <Link href={`/maqalat/${meta.ar}/`} className="text-teal hover:underline" dir="rtl">
              اقرأ هذا المقال بالعربية ←
            </Link>
          </div>
        )}
      </article>
    </div>
  );
}
