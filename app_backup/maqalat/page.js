import { getAllArticles } from '../../lib/content';
import { ArticleCard } from '../../components/Cards';

export const metadata = {
  title: 'جميع المقالات',
  description: 'تصفّح جميع مقالات أسنانك التثقيفية عن صحة الأسنان والفم.',
};

export default async function ArticlesIndex() {
  const articles = await getAllArticles();
  return (
    <div className="max-w-6xl mx-auto px-5 py-14">
      <h1 className="text-4xl font-display font-bold text-ink mb-2">جميع المقالات</h1>
      <p className="text-ink/60 mb-10">محتوى علمي يراجعه أطباء مختصون</p>
      {articles.length === 0 ? (
        <p className="text-ink/50">لا توجد مقالات بعد.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
