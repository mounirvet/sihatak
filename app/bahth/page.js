import { getAllArticles } from '../../lib/content';
import { PILLARS } from '../../lib/site';
import SearchClient from '../../components/SearchClient';

export const metadata = {
  title: 'بحث',
  description: 'ابحث في مقالات أسنانك حول صحة الأسنان واللثة والفم.',
  alternates: { canonical: '/bahth/' },
};

// Same normalization the client uses, so the prebuilt haystack matches queries.
function normalize(text = '') {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u0652]/g, '')
    .replace(/[إأآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ـ/g, '')
    .replace(/[.,،:؛!؟"'(){}\[\]\-—…?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default async function SearchPage() {
  const all = await getAllArticles();
  const pillarTitle = (s) => (PILLARS.find((p) => p.slug === s) || {}).title || '';

  // Build a small static index (title, excerpt, pillar) + pre-normalized fields
  // for fast forgiving matching. This ships as data in the page — no runtime
  // fetch, no external service, stays SEO-safe.
  const index = all.map((a) => {
    const title = a.meta.title || '';
    const excerpt = a.meta.excerpt || '';
    const pillar = pillarTitle(a.meta.pillar);
    return {
      slug: a.slug,
      title,
      excerpt,
      pillar,
      _nt: normalize(title),
      _n: normalize(`${title} ${excerpt} ${pillar} ${a.meta.answer || ''}`),
    };
  });

  return (
    <div className="bg-sand min-h-screen">
      <div className="max-w-3xl mx-auto px-5 py-12">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-ink mb-2">ابحث في أسنانك</h1>
        <p className="text-ink/60 mb-8">
          ابحث في {all.length} مقالاً حول صحة الأسنان واللثة والفم.
        </p>
        <SearchClient index={index} />
      </div>
    </div>
  );
}
