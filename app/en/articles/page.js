import Link from 'next/link';
import { getAllEnArticles } from '../../../lib/contentEn';
import { SITE_EN, getPillarEn } from '../../../lib/siteEn';

export const metadata = {
  title: 'Articles — Asnanik',
  description: 'Browse Asnanik’s dental and oral health articles, reviewed by qualified dentists.',
  alternates: { canonical: '/en/articles/', languages: { en: '/en/articles/', ar: '/maqalat/' } },
};

export default async function EnArticlesIndex() {
  const articles = await getAllEnArticles();
  return (
    <div className="max-w-6xl mx-auto px-5 py-14">
      <h1 className="text-4xl font-display font-bold text-ink mb-2">Articles</h1>
      <p className="text-ink/60 mb-10">Science-based content, reviewed by dental professionals</p>
      {articles.length === 0 ? (
        <p className="text-ink/50">No articles yet.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => {
            const pillar = getPillarEn(a.meta.pillar);
            return (
              <Link
                key={a.slug}
                href={`/en/articles/${a.slug}/`}
                className="block bg-cream border border-line rounded-xl p-5 shadow-card hover:shadow-soft hover:border-teal-light transition-all group"
              >
                {pillar && (
                  <span className="text-xs text-teal-dark bg-mint rounded-full px-2.5 py-0.5 inline-block mb-2">
                    {pillar.title}
                  </span>
                )}
                <h2 className="font-display text-lg text-ink group-hover:text-teal mb-1 leading-snug">
                  {a.meta.title}
                </h2>
                <p className="text-sm text-ink/55 leading-relaxed line-clamp-2">{a.meta.excerpt}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
