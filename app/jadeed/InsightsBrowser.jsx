'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

const AR_MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
function formatArabicDate(iso) {
  if (!iso) return '';
  const [y, m, d] = String(iso).split('-').map((n) => parseInt(n, 10));
  if (!y || !m || !d) return iso;
  return `${d} ${AR_MONTHS[m - 1]} ${y}`;
}

// Normalize Arabic text for forgiving search: unify alef/ya/ta-marbuta,
// strip tashkeel, drop tatweel, lowercase Latin. Lets "الاسنان" match "الأسنان".
function normalizeAr(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0670]/g, '') // tashkeel + dagger alef
    .replace(/\u0640/g, '')                 // tatweel
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627') // آأإٱ -> ا
    .replace(/\u0649/g, '\u064A')           // ى -> ي
    .replace(/\u0629/g, '\u0647')           // ة -> ه
    .trim();
}

export default function InsightsBrowser({ insights, categories }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const filtered = useMemo(() => {
    const q = normalizeAr(query);
    return insights.filter((it) => {
      if (activeCategory && it.category !== activeCategory) return false;
      if (!q) return true;
      const haystack = normalizeAr(
        `${it.title || ''} ${it.excerpt || ''} ${it.category || ''}`
      );
      return haystack.includes(q);
    });
  }, [insights, query, activeCategory]);

  const hasControls = insights.length > 0;

  return (
    <div>
      {hasControls && (
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في المستجدّات…"
              aria-label="ابحث في المستجدّات"
              className="w-full bg-cream border border-line rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:border-teal-light focus:ring-2 focus:ring-mint transition"
            />
          </div>

          {/* Category chips */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="تصفية حسب التصنيف">
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                aria-pressed={activeCategory === null}
                className={
                  'text-xs rounded-full px-3 py-1 border transition ' +
                  (activeCategory === null
                    ? 'bg-teal text-white border-teal'
                    : 'bg-cream text-ink/70 border-line hover:border-teal-light')
                }
              >
                الكل
              </button>
              {categories.map((c) => (
                <button
                  key={c.category}
                  type="button"
                  onClick={() => setActiveCategory(c.category)}
                  aria-pressed={activeCategory === c.category}
                  className={
                    'text-xs rounded-full px-3 py-1 border transition ' +
                    (activeCategory === c.category
                      ? 'bg-teal text-white border-teal'
                      : 'bg-cream text-ink/70 border-line hover:border-teal-light')
                  }
                >
                  {c.category}
                  <span className="text-ink/35 ms-1">{c.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {insights.length === 0 ? (
        <p className="text-ink/50">لا توجد منشورات بعد.</p>
      ) : filtered.length === 0 ? (
        <p className="text-ink/50">
          لا توجد نتائج مطابقة. جرّب كلمة بحث أخرى أو
          <button
            type="button"
            onClick={() => { setQuery(''); setActiveCategory(null); }}
            className="text-teal hover:text-teal-dark underline underline-offset-2 mx-1"
          >
            امسح عوامل التصفية
          </button>
          .
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it) => (
            <Link
              key={it.slug}
              href={`/jadeed/${it.slug}/`}
              className="block bg-cream border border-line rounded-xl p-5 shadow-card hover:shadow-soft hover:border-teal-light transition-all group"
            >
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {it.category && (
                  <span className="text-xs text-teal-dark bg-mint rounded-full px-2.5 py-0.5">
                    {it.category}
                  </span>
                )}
                <time className="text-xs text-coral font-medium" dateTime={it.date}>
                  {formatArabicDate(it.date)}
                </time>
              </div>
              <h2 className="font-display text-lg text-ink group-hover:text-teal mb-1 leading-snug">
                {it.title}
              </h2>
              <p className="text-sm text-ink/55 leading-relaxed line-clamp-3">{it.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
