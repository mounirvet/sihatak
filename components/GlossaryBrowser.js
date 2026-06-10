'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PILLARS } from '../lib/site';

// Normalize Arabic for search: strip tashkeel, unify alef/ya/ta-marbuta, drop tatweel.
function normalize(str) {
  return (str || '')
    .replace(/[\u064B-\u0652\u0670]/g, '') // harakat
    .replace(/\u0640/g, '') // tatweel
    .replace(/[\u0622\u0623\u0625]/g, '\u0627') // آأإ -> ا
    .replace(/\u0649/g, '\u064A') // ى -> ي
    .replace(/\u0629/g, '\u0647') // ة -> ه
    .toLowerCase()
    .trim();
}

// First Arabic letter for grouping (after normalization, using common alphabetical order).
const ALPHABET = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'.split('');
function firstLetter(term) {
  const n = normalize(term).replace(/[^\u0621-\u064A]/g, '');
  const c = n.charAt(0);
  return ALPHABET.includes(c) ? c : '#';
}

export default function GlossaryBrowser({ terms }) {
  const [query, setQuery] = useState('');
  const [pillar, setPillar] = useState('all');

  const filtered = useMemo(() => {
    const q = normalize(query);
    return terms.filter((t) => {
      if (pillar !== 'all' && t.pillar !== pillar) return false;
      if (!q) return true;
      const hay = normalize(
        [t.term, t.termEn, ...(t.alternateName || [])].join(' ')
      );
      return hay.includes(q);
    });
  }, [terms, query, pillar]);

  // group filtered by first Arabic letter, in alphabet order
  const groups = useMemo(() => {
    const map = {};
    filtered.forEach((t) => {
      const l = firstLetter(t.term);
      (map[l] = map[l] || []).push(t);
    });
    const order = [...ALPHABET, '#'];
    return order
      .filter((l) => map[l])
      .map((l) => ({ letter: l, items: map[l].sort((a, b) => a.term.localeCompare(b.term, 'ar')) }));
  }, [filtered]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن مصطلح…"
          className="flex-1 bg-cream border border-line rounded-full px-5 py-2.5 text-ink placeholder:text-ink/40 focus:outline-none focus:border-teal"
        />
        <select
          value={pillar}
          onChange={(e) => setPillar(e.target.value)}
          className="bg-cream border border-line rounded-full px-4 py-2.5 text-ink focus:outline-none focus:border-teal"
        >
          <option value="all">كل المحاور</option>
          {PILLARS.map((p) => (
            <option key={p.slug} value={p.slug}>{p.title}</option>
          ))}
        </select>
      </div>

      <p className="text-sm text-ink/50 mb-6">{filtered.length} مصطلحاً</p>

      {groups.length === 0 && (
        <p className="text-ink/50 py-10 text-center">لا توجد مصطلحات مطابقة. جرّب كلمة أخرى.</p>
      )}

      {groups.map((g) => (
        <section key={g.letter} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal text-cream font-display text-lg">
              {g.letter}
            </span>
            <span className="h-px bg-line flex-1" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {g.items.map((t) => (
              <Link
                key={t.slug}
                href={`/mustalahat/${t.slug}/`}
                className="block bg-cream border border-line rounded-xl p-5 shadow-card hover:shadow-soft hover:border-teal-light transition-all group"
              >
                <h2 className="font-display text-lg text-ink group-hover:text-teal mb-1">{t.term}</h2>
                <p className="text-sm text-ink/55 leading-relaxed line-clamp-2">{t.blurb}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
