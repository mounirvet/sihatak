'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PILLARS } from '../lib/site';
import { PILLAR_ICONS, IconArrowL, IconSearch, IconClose } from './Icons';

// ===== Maqalat Explorer — client-side filtering for the articles index =====
// Why client-side: the site is a static export (no server to query). All
// articles still render into the static HTML on first paint; this component
// only filters/sorts what's already there, so crawlers and AI engines see the
// full library (SEO/AEO-safe). Filters enhance discovery, never hide content.
//
// Features: inline search (Arabic-normalized), pillar chips, reading-time
// (quick/deep), sort (newest/recently-updated/oldest), and saved articles
// persisted in localStorage (works on the live site; in a sandboxed preview
// localStorage may be unavailable, so every access is guarded).

// Bookmark icons defined locally so this feature needs no edit to Icons.js.
function IconBookmark({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1z" />
    </svg>
  );
}
function IconBookmarkFilled({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1z" />
    </svg>
  );
}

const STORAGE_KEY = 'asnanik:saved-articles';

// Normalize Arabic for forgiving search: strip tashkeel, unify alef/ya/ta.
function normAr(s) {
  return String(s || '')
    .replace(/[\u064B-\u0652\u0670]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .toLowerCase()
    .trim();
}

const SORTS = [
  { id: 'newest', label: 'الأحدث' },
  { id: 'updated', label: 'الأحدث تحديثاً' },
  { id: 'oldest', label: 'الأقدم' },
];

const SPEEDS = [
  { id: 'all', label: 'كل الأطوال' },
  { id: 'quick', label: 'قراءة سريعة' },
  { id: 'deep', label: 'مقالات متعمّقة' },
];

export default function MaqalatExplorer({ articles }) {
  const [q, setQ] = useState('');
  const [activePillars, setActivePillars] = useState([]);
  const [speed, setSpeed] = useState('all');
  const [sort, setSort] = useState('newest');
  const [saved, setSaved] = useState([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load saved bookmarks from localStorage once on mount (guarded for sandbox).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch (_) {
      /* storage unavailable — feature degrades to off */
    }
    setHydrated(true);
  }, []);

  const persistSaved = useCallback((next) => {
    setSaved(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (_) {
      /* ignore */
    }
  }, []);

  const toggleSave = useCallback(
    (slug) => {
      persistSaved(saved.includes(slug) ? saved.filter((s) => s !== slug) : [...saved, slug]);
    },
    [saved, persistSaved]
  );

  const togglePillar = (slug) => {
    setActivePillars((prev) => (prev.includes(slug) ? prev.filter((p) => p !== slug) : [...prev, slug]));
  };

  // Only count pillars that actually have articles, so we never show an empty chip.
  const pillarsWithCounts = useMemo(() => {
    const counts = new Map();
    for (const a of articles) {
      const p = a.meta.pillar;
      if (p) counts.set(p, (counts.get(p) || 0) + 1);
    }
    return PILLARS.filter((p) => counts.has(p.slug)).map((p) => ({ ...p, count: counts.get(p.slug) }));
  }, [articles]);

  const filtered = useMemo(() => {
    let r = [...articles];
    if (savedOnly) r = r.filter((a) => saved.includes(a.slug));
    if (q) {
      const nq = normAr(q);
      r = r.filter(
        (a) => normAr(a.meta.title).includes(nq) || normAr(a.meta.excerpt || a.meta.answer).includes(nq)
      );
    }
    if (activePillars.length) r = r.filter((a) => activePillars.includes(a.meta.pillar));
    if (speed === 'quick') r = r.filter((a) => (a.readingMinutes || 0) <= 4);
    if (speed === 'deep') r = r.filter((a) => (a.readingMinutes || 0) >= 7);
    r.sort((a, b) => {
      if (sort === 'newest')
        return (b.meta.order || 0) - (a.meta.order || 0) || (b.meta.date || '').localeCompare(a.meta.date || '');
      if (sort === 'updated')
        return (b.meta.updated || b.meta.date || '').localeCompare(a.meta.updated || a.meta.date || '');
      if (sort === 'oldest') return (a.meta.date || '').localeCompare(b.meta.date || '');
      return 0;
    });
    return r;
  }, [articles, q, activePillars, speed, sort, saved, savedOnly]);

  const hasFilters = q || activePillars.length || speed !== 'all' || savedOnly;
  const clearAll = () => {
    setQ('');
    setActivePillars([]);
    setSpeed('all');
    setSavedOnly(false);
  };

  const chipBase =
    'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors';

  return (
    <div>
      {/* Search */}
      <div className="relative mb-5">
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/35 pointer-events-none">
          <IconSearch className="w-5 h-5" />
        </span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث في المقالات…"
          aria-label="ابحث في المقالات"
          className="w-full bg-cream border border-line rounded-xl py-3 pr-11 pl-4 text-ink placeholder:text-ink/40 focus:outline-none focus:border-teal-light focus:ring-2 focus:ring-teal/15 transition"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ('')}
            aria-label="مسح البحث"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors"
          >
            <IconClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Pillar chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {pillarsWithCounts.map((p) => {
          const Icon = PILLAR_ICONS[p.slug];
          const active = activePillars.includes(p.slug);
          return (
            <button
              key={p.slug}
              type="button"
              onClick={() => togglePillar(p.slug)}
              aria-pressed={active}
              className={`${chipBase} ${
                active
                  ? 'bg-teal text-cream border-teal'
                  : 'bg-cream text-ink/75 border-line hover:border-teal-light hover:text-teal'
              }`}
            >
              {Icon ? <Icon className="w-4 h-4" /> : null}
              {p.title}
              <span className={active ? 'text-cream/70' : 'text-ink/40'}>{p.count}</span>
            </button>
          );
        })}
      </div>

      {/* Reading time + sort + saved row */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {SPEEDS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSpeed(s.id)}
            aria-pressed={speed === s.id}
            className={`${chipBase} ${
              speed === s.id
                ? 'bg-mint text-teal-dark border-mint'
                : 'bg-cream text-ink/65 border-line hover:border-teal-light'
            }`}
          >
            {s.label}
          </button>
        ))}

        <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />

        {/* Saved toggle */}
        <button
          type="button"
          onClick={() => setSavedOnly((v) => !v)}
          aria-pressed={savedOnly}
          className={`${chipBase} ${
            savedOnly ? 'bg-coral text-cream border-coral' : 'bg-cream text-ink/65 border-line hover:border-coral'
          }`}
        >
          {savedOnly ? <IconBookmarkFilled className="w-4 h-4" /> : <IconBookmark className="w-4 h-4" />}
          المحفوظة{hydrated && saved.length ? ` (${saved.length})` : ''}
        </button>

        {/* Sort — pushed to the far edge */}
        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-ink/50">
            ترتيب:
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-cream border border-line rounded-lg py-1.5 pr-3 pl-8 text-sm text-ink focus:outline-none focus:border-teal-light cursor-pointer"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count + clear */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-ink/55">
          {filtered.length === articles.length
            ? `${articles.length} مقالاً`
            : `${filtered.length} من ${articles.length} مقالاً`}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-teal hover:text-teal-dark hover:underline transition-colors"
          >
            مسح كل الفلاتر
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-cream border border-line rounded-2xl">
          <p className="text-ink/70 mb-1">لا توجد مقالات مطابقة لاختياراتك.</p>
          <p className="text-ink/45 text-sm mb-5">جرّب توسيع الفلاتر أو مسحها.</p>
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal text-cream text-sm font-medium hover:bg-teal-dark transition-colors"
          >
            مسح الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <ExplorerCard
              key={a.slug}
              article={a}
              isSaved={hydrated && saved.includes(a.slug)}
              onToggleSave={toggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Card variant with a bookmark button overlaid on the existing card design.
// Mirrors ArticleCard styling so the grid looks identical, plus a save toggle.
function ExplorerCard({ article, isSaved, onToggleSave }) {
  const { slug, meta, readingMinutes } = article;
  return (
    <div className="group relative flex flex-col bg-cream border border-line rounded-2xl p-6 shadow-card hover:shadow-soft hover:border-teal-light transition-all duration-200">
      <button
        type="button"
        onClick={() => onToggleSave(slug)}
        aria-label={isSaved ? 'إزالة من المحفوظة' : 'حفظ المقال'}
        aria-pressed={isSaved}
        className={`absolute top-4 left-4 z-10 w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
          isSaved ? 'text-coral' : 'text-ink/25 hover:text-coral'
        }`}
      >
        {isSaved ? <IconBookmarkFilled className="w-5 h-5" /> : <IconBookmark className="w-5 h-5" />}
      </button>

      <Link href={`/maqalat/${slug}/`} className="flex flex-col flex-1">
        <h3 className="font-display text-lg text-ink group-hover:text-teal mb-2 leading-snug transition-colors pl-8">
          {meta.title}
        </h3>
        <p className="text-sm text-ink/55 leading-relaxed line-clamp-2 flex-1">
          {meta.excerpt || meta.answer}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-coral font-medium">
            اقرأ المقال
            <IconArrowL className="w-3.5 h-3.5" />
          </span>
          {readingMinutes ? (
            <span className="text-xs text-ink/40">{readingMinutes} د قراءة</span>
          ) : null}
        </div>
      </Link>
    </div>
  );
}
