import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticle, getArticleSlugs, getArticlesByPillar, getAllArticles, getAllArticlesMeta } from '../../../lib/content';
import { getAllInsights, getAllInsightsMeta } from '../../../lib/insights';
import { getRelatedArticles } from '../../../lib/related';
import { getPillarImage, getArticleImage } from '../../../lib/pillarImages';
import { getAuthoritativeSources } from '../../../lib/authorities';
import { PILLARS } from '../../../lib/site';
import { getCategoriesForPillar } from '../../../lib/storeCategories';
import ArticleSchema from '../../../components/ArticleSchema';
import { ReviewerByline, AnswerBlock, KeyTakeaways, FAQ, Sources } from '../../../components/ArticleParts';
import { TableOfContents, ReadingProgress, ShareRow } from '../../../components/UXParts';
import { IconClock } from '../../../components/Icons';
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
  const { slug, meta, contentHtml, toc, readingMinutes } = article;
  const pillar = PILLARS.find((p) => p.slug === meta.pillar);

  // All articles (metadata only) — used for sibling links and the cross-pillar
  // related engine. These consumers need only { slug, meta }, so we use the
  // cached frontmatter-only loader instead of rendering every article's body.
  const allArticles = getAllArticlesMeta();

  // Same-pillar siblings (deepens cluster authority).
  const siblings = pillar
    ? allArticles.filter((a) => a.meta.pillar === pillar.slug && a.slug !== slug).slice(0, 3)
    : [];

  // Cross-pillar related, scored by topical relevance — now also includes
  // insights, so evergreen articles can surface and link into the "الجديد"
  // hubs (and the link graph runs both directions, not just outward).
  const allInsights = getAllInsightsMeta();
  const related = getRelatedArticles(article, [...allArticles, ...allInsights], 4);

  // "Read next" — the single strongest next step for the reader. Prefer the top
  // related article; fall back to the first sibling. Keeps readers moving
  // through the site (better engagement + internal link flow).
  const nextRead = related[0] || siblings[0] || null;
  // Avoid repeating the next-read pick in the grids below.
  const relatedRest = related.filter((a) => !nextRead || a.slug !== nextRead.slug);
  const siblingsRest = siblings.filter((a) => !nextRead || a.slug !== nextRead.slug).slice(0, 3);

  // Map pillar slug -> title for labeling related cards.
  const pillarTitle = (s) => (PILLARS.find((p) => p.slug === s) || {}).title || '';
  // Build the correct href for a related item, which may be an article or an insight.
  const hrefFor = (item) => (item.kind === 'insight' ? `/jadeed/${item.slug}/` : `/maqalat/${item.slug}/`);

  // Hero image for this article's pillar (null if none yet).
  const heroImage = getArticleImage(slug, meta);

  // Verified authoritative outbound sources for this pillar (trust signal).
  const authSources = getAuthoritativeSources(meta.pillar);
  // Brand-neutral shop categories relevant to this article's pillar (may be empty).
  const shopCategories = getCategoriesForPillar(meta.pillar);

  return (
    <article className="bg-sand">
      <ArticleSchema slug={slug} meta={meta} />
      <ReadingProgress />

      {/* Hero image — relevant pillar photo, also aids SEO/AI multimodal */}
      {heroImage && (
        <div className="w-full max-w-5xl mx-auto px-5 pt-8">
          <img
            src={heroImage}
            alt={meta.title}
            width={1280}
            height={720}
            className="w-full h-auto rounded-2xl shadow-card object-cover"
            style={{ aspectRatio: '16 / 9' }}
            loading="eager"
          />
        </div>
      )}

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

        {/* Reading time — a small orientation cue for the reader */}
        <p className="flex items-center gap-1.5 text-sm text-ink/45 mb-2 print:hidden">
          <IconClock className="w-4 h-4" /> وقت القراءة: نحو {readingMinutes} دقيقة
        </p>

        {/* Answer block — placed immediately, what AI extracts */}
        {meta.answer && (
          <AnswerBlock>
            <p dangerouslySetInnerHTML={{ __html: meta.answer }} />
          </AnswerBlock>
        )}

        {/* Key takeaways — scannable bullet summary; high-value extractable
            content for AI answer engines. Renders only when provided. */}
        <KeyTakeaways items={meta.takeaways} />

        {/* Visible medical reviewer trust signal */}
        <ReviewerByline reviewerId={meta.reviewer} date={meta.date} updated={meta.updated} />

        {/* Table of contents — jump-links built from the article's headings */}
        <TableOfContents items={toc} />

        {/* Body */}
        <div className="prose-ar" dangerouslySetInnerHTML={{ __html: contentHtml }} />

        {/* Share row — WhatsApp / X / copy link (privacy-friendly) */}
        <ShareRow title={meta.title} />

        {/* FAQ — mirrors FAQPage schema */}
        <FAQ items={meta.faq} />

        {/* Sources */}
        <Sources items={meta.sources} />

        {/* Authoritative external sources — trust-neighborhood signal.
            Links to recognized health authorities (WHO, ADA, CDC). */}
        {authSources.length > 0 && (
          <div className="mt-8 bg-cream border border-line rounded-xl p-5">
            <h2 className="text-base font-display text-ink mb-3">مصادر موثوقة للاستزادة</h2>
            <ul className="space-y-2.5">
              {authSources.map((s) => (
                <li key={s.url} className="text-sm leading-relaxed">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-teal hover:underline font-medium"
                  >
                    {s.name}
                  </a>
                  <span className="text-ink/45"> — {s.desc}</span>
                  <span className="text-ink/30 block text-xs" dir="ltr">{s.nameEn}</span>
                </li>
              ))}
            </ul>
            <p className="text-ink/35 text-xs mt-3">
              روابط لمؤسسات صحية عالمية موثوقة للاطّلاع على مزيد من المعلومات.
            </p>
          </div>
        )}

        {/* Brand-neutral shop CTA — links to relevant shop CATEGORIES only,
            never a branded product. Keeps the editorial/commerce wall intact
            while giving readers a helpful next step to explore tools. */}
        {shopCategories.length > 0 && (
          <div className="mt-8 bg-mint/30 border border-mint rounded-xl p-5">
            <h2 className="text-base font-display text-teal-dark mb-2">أدوات قد تساعدك</h2>
            <p className="text-sm text-ink/70 mb-4">
              إذا كنت تبحث عن أدوات للعناية بأسنانك، يمكنك تصفّح فئات المتجر ذات الصلة.
              استشر طبيب الأسنان لاختيار ما يناسب حالتك.
            </p>
            <div className="flex flex-wrap gap-2">
              {shopCategories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/shop/${c.slug}/`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white border border-teal/20 px-4 py-2 text-sm font-medium text-teal hover:bg-teal hover:text-white transition"
                >
                  {c.title_ar}
                  <span aria-hidden="true">←</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Internal links up + across */}
        {pillar && (
          <div className="mt-10 text-sm">
            <Link href={`/mahawir/${pillar.slug}/`} className="text-teal hover:underline">
              ← العودة إلى محور: {pillar.title}
            </Link>
          </div>
        )}
      </div>

      {/* Read next — a single strong next step to keep the reader engaged */}
      {nextRead && (
        <section className="max-w-6xl mx-auto px-5 pt-4 pb-2 print:hidden">
          <Link
            href={hrefFor(nextRead)}
            className="flex items-center gap-4 bg-teal/5 border border-teal-light/40 rounded-2xl p-5 hover:bg-teal/10 hover:border-teal-light transition-all group"
          >
            <span className="shrink-0 w-12 h-12 rounded-full bg-teal text-white flex items-center justify-center text-xl" aria-hidden="true">←</span>
            <span>
              <span className="block text-xs text-teal-dark font-medium mb-1">اقرأ بعد ذلك</span>
              <span className="block font-display text-lg text-ink group-hover:text-teal leading-snug">
                {nextRead.meta.title}
              </span>
            </span>
          </Link>
        </section>
      )}

      {/* Same-pillar siblings — deepens cluster authority */}
      {siblingsRest.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 pb-8 pt-6 print:hidden">
          <h2 className="text-2xl font-display text-ink mb-6">
            من نفس المحور{pillar ? `: ${pillar.title}` : ''}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {siblingsRest.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* Cross-pillar related — builds the site-wide topical graph */}
      {relatedRest.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 pb-16 print:hidden">
          <h2 className="text-2xl font-display text-ink mb-6">قد يهمّك أيضاً</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedRest.map((a) => (
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
    </article>
  );
}
