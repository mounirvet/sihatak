import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticle, getArticleSlugs, getArticlesByPillar, getAllArticles } from '../../../lib/content';
import { getRelatedArticles } from '../../../lib/related';
import { PILLARS } from '../../../lib/site';
import ArticleSchema from '../../../components/ArticleSchema';
import { ReviewerByline, AnswerBlock, FAQ, Sources } from '../../../components/ArticleParts';
import { ArticleCard } from '../../../components/Cards';

export async function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  try {
    const { meta } = await getArticle(params.slug);
    return {
      title: meta.title,
      description: meta.excerpt || meta.answer,
      alternates: { canonical: `/maqalat/${params.slug}/` },
      openGraph: { title: meta.title, description: meta.excerpt || meta.answer, type: 'article' },
    };
  } catch {
    return {};
  }
}

export default async function ArticlePage({ params }) {
  let article;
  try {
    article = await getArticle(params.slug);
  } catch {
    notFound();
  }
  const { slug, meta, contentHtml } = article;
  const pillar = PILLARS.find((p) => p.slug === meta.pillar);

  // All articles, used for both sibling links and the cross-pillar related engine.
  const allArticles = await getAllArticles();

  // Same-pillar siblings (deepens cluster authority).
  const siblings = pillar
    ? allArticles.filter((a) => a.meta.pillar === pillar.slug && a.slug !== slug).slice(0, 3)
    : [];

  // Cross-pillar related articles, scored by topical relevance — builds the
  // site-wide internal-linking graph that Google + AI engines reward.
  const related = getRelatedArticles(article, allArticles, 4);

  // Map pillar slug -> title for labeling related cards.
  const pillarTitle = (s) => (PILLARS.find((p) => p.slug === s) || {}).title || '';

  return (
    <article className="bg-sand">
      <ArticleSchema slug={slug} meta={meta} />

      <div className="max-w-prose mx-auto px-5 py-12">
        {/* Breadcrumb — helps both users and crawlers map the hierarchy */}
        <nav className="text-sm text-ink/50 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-teal">الرئيسية</Link>
          <span>/</span>
          {pillar && (
            <>
              <Link href={`/mahawir/${pillar.slug}/`} className="hover:text-teal">{pillar.title}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-ink/70">{meta.title}</span>
        </nav>

        {/* H1 = the exact question users ask */}
        <h1 className="text-3xl md:text-4xl font-display font-bold text-ink leading-tight mb-2">
          {meta.title}
        </h1>

        {/* Answer block — placed immediately, what AI extracts */}
        {meta.answer && (
          <AnswerBlock>
            <p dangerouslySetInnerHTML={{ __html: meta.answer }} />
          </AnswerBlock>
        )}

        {/* Visible medical reviewer trust signal */}
        <ReviewerByline reviewerId={meta.reviewer} date={meta.date} updated={meta.updated} />

        {/* Body */}
        <div className="prose-ar" dangerouslySetInnerHTML={{ __html: contentHtml }} />

        {/* FAQ — mirrors FAQPage schema */}
        <FAQ items={meta.faq} />

        {/* Sources */}
        <Sources items={meta.sources} />

        {/* Internal links up + across */}
        {pillar && (
          <div className="mt-10 text-sm">
            <Link href={`/mahawir/${pillar.slug}/`} className="text-teal hover:underline">
              ← العودة إلى محور: {pillar.title}
            </Link>
          </div>
        )}
      </div>

      {/* Same-pillar siblings — deepens cluster authority */}
      {siblings.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 pb-8">
          <h2 className="text-2xl font-display text-ink mb-6">
            من نفس المحور{pillar ? `: ${pillar.title}` : ''}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* Cross-pillar related — builds the site-wide topical graph */}
      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 pb-16">
          <h2 className="text-2xl font-display text-ink mb-6">قد يهمّك أيضاً</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((a) => (
              <Link
                key={a.slug}
                href={`/maqalat/${a.slug}/`}
                className="block bg-cream border border-line rounded-xl p-5 shadow-card hover:shadow-soft hover:border-teal-light transition-all group"
              >
                {pillarTitle(a.meta.pillar) && (
                  <span className="inline-block text-xs text-teal-dark bg-mint rounded-full px-2.5 py-0.5 mb-2">
                    {pillarTitle(a.meta.pillar)}
                  </span>
                )}
                <h3 className="font-display text-base text-ink group-hover:text-teal leading-snug">
                  {a.meta.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
