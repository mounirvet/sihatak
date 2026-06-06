import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticle, getArticleSlugs, getArticlesByPillar } from '../../../lib/content';
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

  // sibling articles for internal linking (topical authority graph)
  const siblings = pillar
    ? (await getArticlesByPillar(pillar.slug)).filter((a) => a.slug !== slug).slice(0, 3)
    : [];

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

      {/* Related articles — sibling cluster links */}
      {siblings.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 pb-16">
          <h2 className="text-2xl font-display text-ink mb-6">مقالات ذات صلة</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
