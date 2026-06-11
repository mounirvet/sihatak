import { getAllArticles } from '../../lib/content';
import MaqalatExplorer from '../../components/MaqalatExplorer';

export const metadata = {
  title: 'جميع المقالات',
  description: 'تصفّح جميع مقالات أسنانك التثقيفية عن صحة الأسنان والفم.',
};

export default async function ArticlesIndex() {
  const all = await getAllArticles();
  // Pass only the lightweight fields the explorer needs (no heavy contentHtml),
  // so the client bundle stays small. All articles are still rendered/searchable.
  const articles = all.map((a) => ({
    slug: a.slug,
    readingMinutes: a.readingMinutes,
    meta: {
      title: a.meta.title,
      excerpt: a.meta.excerpt || '',
      answer: a.meta.answer || '',
      pillar: a.meta.pillar || '',
      date: a.meta.date || '',
      updated: a.meta.updated || '',
      order: a.meta.order || 0,
    },
  }));

  return (
    <div className="max-w-6xl mx-auto px-5 py-14">
      <h1 className="text-4xl font-display font-bold text-ink mb-2">جميع المقالات</h1>
      <p className="text-ink/60 mb-10">محتوى علمي يراجعه أطباء مختصون</p>
      {articles.length === 0 ? (
        <p className="text-ink/50">لا توجد مقالات بعد.</p>
      ) : (
        <MaqalatExplorer articles={articles} />
      )}
    </div>
  );
}
