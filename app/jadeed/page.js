import Link from 'next/link';
import { getAllInsights } from '../../lib/insights';

const AR_MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
function formatArabicDate(iso) {
  if (!iso) return '';
  const [y, m, d] = String(iso).split('-').map((n) => parseInt(n, 10));
  if (!y || !m || !d) return iso;
  return `${d} ${AR_MONTHS[m - 1]} ${y}`;
}

export const metadata = {
  title: 'الجديد في طب الأسنان',
  description: 'أحدث المستجدّات والأبحاث والاتّجاهات في عالم طب الأسنان وصحة الفم، مشروحة بلغة واضحة لك.',
  alternates: { canonical: '/jadeed/' },
};

export default async function InsightsIndex() {
  const insights = await getAllInsights();
  return (
    <div className="max-w-6xl mx-auto px-5 py-14">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-ink mb-2">الجديد في طب الأسنان</h1>
        <p className="text-ink/60 max-w-2xl leading-relaxed">
          أحدث المستجدّات والأبحاث والاتّجاهات في عالم طب الأسنان وصحة الفم — نقرؤها لك ونشرحها بلغة بسيطة،
          مع الإشارة دائماً إلى مصادرها.
        </p>
      </div>
      {insights.length === 0 ? (
        <p className="text-ink/50">لا توجد منشورات بعد.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {insights.map((it) => (
            <Link
              key={it.slug}
              href={`/jadeed/${it.slug}/`}
              className="block bg-cream border border-line rounded-xl p-5 shadow-card hover:shadow-soft hover:border-teal-light transition-all group"
            >
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {it.meta.category && (
                  <span className="text-xs text-teal-dark bg-mint rounded-full px-2.5 py-0.5">
                    {it.meta.category}
                  </span>
                )}
                <time className="text-xs text-coral font-medium" dateTime={it.meta.date}>
                  {formatArabicDate(it.meta.date)}
                </time>
              </div>
              <h2 className="font-display text-lg text-ink group-hover:text-teal mb-1 leading-snug">
                {it.meta.title}
              </h2>
              <p className="text-sm text-ink/55 leading-relaxed line-clamp-3">{it.meta.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
