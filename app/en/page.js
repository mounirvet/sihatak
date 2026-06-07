import Link from 'next/link';
import { getAllEnArticles } from '../../lib/contentEn';
import { SITE_EN, PILLARS_EN, getPillarEn } from '../../lib/siteEn';

export const metadata = {
  title: 'Asnanik — Trusted Dental & Oral Health Information',
  description: SITE_EN.description,
  alternates: { canonical: '/en/', languages: { en: '/en/', ar: '/' } },
};

export default async function EnHomePage() {
  const articles = await getAllEnArticles();
  const latest = articles.slice(0, 6);

  return (
    <>
      <section className="grain bg-sand">
        <div className="max-w-6xl mx-auto px-5 py-20 md:py-28 text-center">
          <span className="inline-block bg-mint text-teal-dark text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Independent resource · Reviewed by qualified dentists
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-ink leading-tight mb-6">
            Healthy teeth start with
            <br />
            <span className="text-teal">trusted</span> information
          </h1>
          <p className="text-lg md:text-xl text-ink/70 max-w-2xl mx-auto leading-relaxed mb-8">
            {SITE_EN.tagline}. Accurate, science-based dental content for the Gulf region —
            free of ads and commercial interests.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/en/articles/" className="bg-teal text-cream px-7 py-3 rounded-full font-medium hover:bg-teal-dark transition-colors">
              Browse articles
            </Link>
            <Link href="/en/about/" className="border border-teal text-teal px-7 py-3 rounded-full font-medium hover:bg-mint transition-colors">
              About us
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-16">
        <h2 className="text-3xl font-display text-ink mb-2">Main topics</h2>
        <p className="text-ink/60 mb-8">Start with the topic that matters to you</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS_EN.map((p) => (
            <Link
              key={p.slug}
              href="/en/articles/"
              className="block bg-cream border border-line rounded-xl p-6 shadow-card hover:shadow-soft hover:border-teal-light transition-all group"
            >
              <div className="text-3xl mb-3">{p.icon}</div>
              <h3 className="font-display text-xl text-ink group-hover:text-teal mb-1">{p.title}</h3>
              <p className="text-sm text-ink/55 leading-relaxed">{p.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {latest.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 py-16">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-3xl font-display text-ink">Latest articles</h2>
            <Link href="/en/articles/" className="text-teal text-sm hover:underline">View all →</Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((a) => {
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
                  <h3 className="font-display text-lg text-ink group-hover:text-teal mb-1 leading-snug">
                    {a.meta.title}
                  </h3>
                  <p className="text-sm text-ink/55 leading-relaxed line-clamp-2">{a.meta.excerpt}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
