import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getInsight, getInsightSlugs, getAllInsightsMeta } from '../../../lib/insights';
import { getAllArticlesMeta } from '../../../lib/content';
import { getRelatedArticles } from '../../../lib/related';
import { SITE, PILLARS } from '../../../lib/site';
import InsightSchema from '../../../components/InsightSchema';
import { ReviewerByline, AnswerBlock, KeyTakeaways, FAQ, Sources } from '../../../components/ArticleParts';
import { TableOfContents, ReadingProgress, ShareRow } from '../../../components/UXParts';

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

export default async function InsightPage({ params }) {
  const insight = await getInsight(params.slug);
  if (!insight) notFound();
  const { slug, meta, contentHtml, toc, readingMinutes } = insight;

  // Cross-link OUT into the evergreen library + sibling insights, using the
  // same relevance engine articles use. This is the core of making insights
  // first-class hubs in the internal-linking graph rather than dead ends.
  const allArticles = getAllArticlesMeta();
  const allInsights = getAllInsightsMeta();
  const pool = [
    ...allArticles,
    ...allInsights.filter((i) => i.slug !== slug),
  ];
  const related = getRelatedArticles(insight, pool, 4);

  const pillarTitle = (pSlug) => (PILLARS.find((p) => p.slug === pSlug) || {}).title;
  const hrefFor = (item) => (item.kind === 'insight' ? `/jadeed/${item.slug}/` : `/maqalat/${item.slug}/`);

  return (
    <div className="bg-sand">
      <InsightSchema meta={meta} slug={slug} />
      <ReadingProgress />
      <article className="max-w-prose mx-auto px-5 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-ink/50 mb-6 flex items-center gap-2 flex-wrap print:hidden">
          <Link href="/" className="hover:text-teal">الرئيسية</Link>
          <span>/</span>
          <Link href="/jadeed/" className="hover:text-teal">الجديد في طب الأسنان</Link>
        </nav>

        {/* Category + prominent date (recency is the point for this section) */}
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

        {/* Reading time */}
        <p className="text-sm text-ink/45 mb-4 print:hidden">وقت القراءة: نحو {readingMinutes} دقيقة</p>

        {/* Answer block — the extractable, AI-citable summary (if provided) */}
        {meta.answer && (
          <AnswerBlock>
            <p dangerouslySetInnerHTML={{ __html: meta.answer }} />
          </AnswerBlock>
        )}

        {/* Excerpt as lead (kept when there's no answer block) */}
        {!meta.answer && meta.excerpt && (
          <p className="text-lg text-ink/75 leading-relaxed mb-6">{meta.excerpt}</p>
        )}

        {/* Key takeaways — scannable, AI-extractable summary bullets */}
        <KeyTakeaways items={meta.takeaways} />

        {/* Visible medical reviewer trust signal */}
        {meta.reviewer && (
          <ReviewerByline reviewerId={meta.reviewer} date={meta.date} updated={meta.updated} />
        )}

        {/* Table of contents */}
        <TableOfContents items={toc} />

        {/* Body */}
        <div className="prose-ar" dangerouslySetInnerHTML={{ __html: contentHtml }} />

        {/* Share row */}
        <ShareRow title={meta.title} />

        {/* FAQ — mirrors FAQPage schema (if provided) */}
        {Array.isArray(meta.faq) && meta.faq.length > 0 && <FAQ items={meta.faq} />}

        {/* Sources */}
        {Array.isArray(meta.sources) && meta.sources.length > 0 && <Sources items={meta.sources} />}

        {/* Disclaimer — important for research/insight posts */}
        <p className="mt-6 text-xs text-ink/45 leading-relaxed">
          هذا المحتوى تثقيفي ولأغراض التوعية فقط، ولا يُغني عن استشارة طبيب الأسنان. المستجدّات البحثية
          قد تتطوّر مع الوقت، وما يصلح كاتّجاه عام قد لا ينطبق على حالتك الفردية.
        </p>

        <div className="mt-8 print:hidden">
          <Link href="/jadeed/" className="text-teal text-sm hover:underline">← كل المستجدّات</Link>
        </div>
      </article>

      {/* Related — cross-links into the evergreen library and sibling insights */}
      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 pb-16 print:hidden">
          <h2 className="text-2xl font-display text-ink mb-6">اقرأ أيضاً</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((a) => (
              <Link
                key={`${a.kind || 'article'}:${a.slug}`}
                href={hrefFor(a)}
                className="block bg-cream border border-line rounded-xl p-5 shadow-card hover:shadow-soft hover:border-teal-light transition-all group"
              >
                {a.kind === 'insight' ? (
                  <span className="inline-block text-xs text-coral bg-coral/10 rounded-full px-2.5 py-0.5 mb-2">
                    الجديد
                  </span>
                ) : (
                  pillarTitle(a.meta.pillar) && (
                    <span className="inline-block text-xs text-teal-dark bg-mint rounded-full px-2.5 py-0.5 mb-2">
                      {pillarTitle(a.meta.pillar)}
                    </span>
                  )
                )}
                <h3 className="font-display text-base text-ink group-hover:text-teal leading-snug">
                  {a.meta.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
