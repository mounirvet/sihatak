import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getInsight, getInsightSlugs } from '../../../lib/insights';
import { SITE } from '../../../lib/site';
import { getReviewer } from '../../../lib/reviewers';
import { IconCheck } from '../../../components/Icons';

const AR_MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
function formatArabicDate(iso) {
  if (!iso) return '';
  const [y, m, d] = String(iso).split('-').map((n) => parseInt(n, 10));
  if (!y || !m || !d) return iso;
  return `${d} ${AR_MONTHS[m - 1]} ${y}`;
}

export function generateStaticParams() {
  return getInsightSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const insight = await getInsight(params.slug);
  if (!insight) return {};
  const { meta } = insight;
  return {
    title: meta.title,
    description: meta.excerpt,
    alternates: { canonical: `/jadeed/${params.slug}/` },
    openGraph: { title: meta.title, description: meta.excerpt, type: 'article' },
  };
}

function InsightSchema({ meta, slug }) {
  const url = `${SITE.url}/jadeed/${slug}/`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.excerpt,
    inLanguage: 'ar',
    datePublished: meta.date,
    dateModified: meta.updated || meta.date,
    url,
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default async function InsightPage({ params }) {
  const insight = await getInsight(params.slug);
  if (!insight) notFound();
  const { slug, meta, contentHtml } = insight;
  const reviewer = getReviewer(meta.reviewer);

  return (
    <div className="bg-sand">
      <InsightSchema meta={meta} slug={slug} />
      <article className="max-w-prose mx-auto px-5 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-ink/50 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-teal">الرئيسية</Link>
          <span>/</span>
          <Link href="/jadeed/" className="hover:text-teal">الجديد في طب الأسنان</Link>
        </nav>

        {/* Category + prominent date (recency is the point here) */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {meta.category && (
            <span className="text-xs text-teal-dark bg-mint rounded-full px-2.5 py-0.5">{meta.category}</span>
          )}
          <time className="text-sm text-coral font-medium" dateTime={meta.date}>
            {formatArabicDate(meta.date)}
          </time>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-ink leading-tight mb-4">
          {meta.title}
        </h1>

        {/* Reviewer line */}
        {reviewer && (
          <div className="flex items-center gap-2 text-sm text-ink/55 mb-6 pb-6 border-b border-line">
            <IconCheck className="w-4 h-4 text-teal" />
            <span>راجعه طبياً {reviewer.name}</span>
          </div>
        )}

        {/* Excerpt as lead */}
        {meta.excerpt && (
          <p className="text-lg text-ink/75 leading-relaxed mb-8">{meta.excerpt}</p>
        )}

        {/* Body */}
        <div className="prose-ar" dangerouslySetInnerHTML={{ __html: contentHtml }} />

        {/* Sources — emphasized for this section (YMYL discipline) */}
        {meta.sources && meta.sources.length > 0 && (
          <div className="mt-10 bg-mint/30 border border-mint rounded-lg p-5 text-sm">
            <h2 className="text-base font-display text-ink mb-2">المصادر</h2>
            <ul className="space-y-1 text-ink/70">
              {meta.sources.map((s, i) => (
                <li key={i}>{s.title} — {s.publisher}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Disclaimer — important for news/research posts */}
        <p className="mt-6 text-xs text-ink/45 leading-relaxed">
          هذا المحتوى تثقيفي ولأغراض التوعية فقط، ولا يُغني عن استشارة طبيب الأسنان. المستجدّات البحثية
          قد تتطوّر مع الوقت، وما يصلح كاتّجاه عام قد لا ينطبق على حالتك الفردية.
        </p>

        <div className="mt-8">
          <Link href="/jadeed/" className="text-teal text-sm hover:underline">← كل المستجدّات</Link>
        </div>
      </article>
    </div>
  );
}
