'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// Normalize Arabic for forgiving matching: strip diacritics, unify alef/ya/ta,
// drop a leading "ال", so "اللثة" matches "لثة" and "الأسنان" matches "اسنان".
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

function stripAl(w) {
  return w.startsWith('ال') && w.length > 4 ? w.slice(2) : w;
}

export default function SearchClient({ index }) {
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    const query = normalize(q);
    if (query.length < 2) return [];
    const terms = query.split(' ').map(stripAl).filter(Boolean);
    return index
      .map((item) => {
        const hay = item._n; // pre-normalized haystack
        let score = 0;
        for (const t of terms) {
          if (hay.includes(t)) score += 1;
          if (item._nt.includes(t)) score += 2; // title match weighs more
        }
        return { item, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .map((r) => r.item);
  }, [q, index]);

  return (
    <div>
      <div className="relative mb-8">
        <input
          type="search"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث عن موضوع… (مثلاً: نزيف اللثة، تبييض، تسوّس الأطفال)"
          className="w-full bg-cream border border-line rounded-xl px-5 py-4 text-lg text-ink placeholder:text-ink/35 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
          aria-label="ابحث في المقالات"
        />
      </div>

      {q.length >= 2 && (
        <p className="text-sm text-ink/50 mb-4">
          {results.length > 0
            ? `${results.length} نتيجة لـ «${q}»`
            : `لا توجد نتائج لـ «${q}». جرّب كلمة أبسط.`}
        </p>
      )}

      <div className="space-y-3">
        {results.map((item) => (
          <Link
            key={item.slug}
            href={`/maqalat/${item.slug}/`}
            className="block bg-cream border border-line rounded-xl p-5 hover:border-teal-light hover:shadow-card transition-all group"
          >
            {item.pillar && (
              <span className="inline-block text-xs text-teal-dark bg-mint rounded-full px-2.5 py-0.5 mb-2">
                {item.pillar}
              </span>
            )}
            <h2 className="font-display text-lg text-ink group-hover:text-teal leading-snug mb-1">
              {item.title}
            </h2>
            {item.excerpt && (
              <p className="text-sm text-ink/60 leading-relaxed line-clamp-2">{item.excerpt}</p>
            )}
          </Link>
        ))}
      </div>

      {q.length < 2 && (
        <p className="text-ink/40 text-sm text-center py-10">
          اكتب كلمتين أو أكثر للبحث في جميع المقالات.
        </p>
      )}
    </div>
  );
}
