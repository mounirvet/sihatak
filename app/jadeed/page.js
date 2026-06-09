import { getAllInsights, getAllInsightCategories } from '../../lib/insights';
import InsightsBrowser from './InsightsBrowser';

export const metadata = {
  title: 'الجديد في طب الأسنان',
  description: 'أحدث المستجدّات والأبحاث والاتّجاهات في عالم طب الأسنان وصحة الفم، مشروحة بلغة واضحة لك.',
  alternates: { canonical: '/jadeed/' },
};

export default async function InsightsIndex() {
  const all = await getAllInsights();
  const categories = await getAllInsightCategories();

  // Pass only plain, serializable fields to the client component.
  const insights = all.map((it) => ({
    slug: it.slug,
    title: it.meta.title || '',
    excerpt: it.meta.excerpt || '',
    category: it.meta.category || '',
    date: it.meta.date || '',
  }));

  return (
    <div className="max-w-6xl mx-auto px-5 py-14">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-ink mb-2">الجديد في طب الأسنان</h1>
        <p className="text-ink/60 max-w-2xl leading-relaxed">
          أحدث المستجدّات والأبحاث والاتّجاهات في عالم طب الأسنان وصحة الفم — نقرؤها لك ونشرحها بلغة بسيطة،
          مع الإشارة دائماً إلى مصادرها.
        </p>
      </div>
      <InsightsBrowser insights={insights} categories={categories} />
    </div>
  );
}
