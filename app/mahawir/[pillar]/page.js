import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PILLARS, SITE } from '../../../lib/site';
import { getArticlesByPillarMeta } from '../../../lib/content';
import { ArticleCard } from '../../../components/Cards';
import { PILLAR_ICONS } from '../../../components/Icons';

export function generateStaticParams() {
  return PILLARS.map((p) => ({ pillar: p.slug }));
}

export function generateMetadata({ params }) {
  const pillar = PILLARS.find((p) => p.slug === params.pillar);
  if (!pillar) return {};
  return {
    title: pillar.title,
    description: pillar.summary,
    alternates: { canonical: `/mahawir/${pillar.slug}/` },
  };
}

export default async function PillarPage({ params }) {
  const pillar = PILLARS.find((p) => p.slug === params.pillar);
  if (!pillar) notFound();

  const articles = getArticlesByPillarMeta(pillar.slug);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pillar.title,
    description: pillar.summary,
    url: `${SITE.url}/mahawir/${pillar.slug}/`,
    inLanguage: 'ar',
    isPartOf: { '@id': `${SITE.url}/#website` },
  };

  return (
    <div className="bg-sand">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="grain bg-cream border-b border-line">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <nav className="text-sm text-ink/50 mb-4">
            <Link href="/mahawir/" className="hover:text-teal">المحاور</Link>
            <span className="mx-2">/</span>
            <span className="text-ink/70">{pillar.title}</span>
          </nav>
          {(() => { const Icon = PILLAR_ICONS[pillar.slug]; return Icon ? (
            <div className="w-14 h-14 rounded-2xl bg-mint text-teal flex items-center justify-center mb-5"><Icon className="w-7 h-7" /></div>
          ) : null; })()}
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-3">{pillar.title}</h1>
          <p className="text-lg text-ink/70 max-w-2xl leading-relaxed">{pillar.summary}</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-14">
        {articles.length === 0 ? (
          <p className="text-ink/50">مقالات هذا المحور قيد الإعداد.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
