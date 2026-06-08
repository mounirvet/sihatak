'use client';

import { useEffect, useState } from 'react';

// ===== Table of Contents =====
// Renders a jump-link list from the headings extracted at build time. The links
// are real anchors to heading ids, so they work even without JS and stay fully
// in the static HTML (SEO/GEO-safe). Collapsible on mobile to save space.
export function TableOfContents({ items }) {
  if (!items || items.length < 3) return null; // only worth it for longer articles
  return (
    <nav
      aria-label="محتويات المقال"
      className="my-6 bg-cream border border-line rounded-xl p-5"
    >
      <details open className="group">
        <summary className="flex items-center justify-between cursor-pointer list-none font-display text-ink text-base">
          <span className="flex items-center gap-2">
            <span className="text-teal" aria-hidden="true">☰</span>
            في هذا المقال
          </span>
          <span className="text-ink/40 text-sm group-open:rotate-180 transition-transform" aria-hidden="true">▾</span>
        </summary>
        <ol className="mt-4 space-y-2 pr-1">
          {items.map((it, i) => (
            <li key={it.id} className="text-sm leading-relaxed">
              <a
                href={`#${it.id}`}
                className="text-ink/75 hover:text-teal transition-colors flex gap-2"
              >
                <span className="text-teal/50 shrink-0">{i + 1}.</span>
                <span>{it.text}</span>
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}

// ===== Reading progress bar + Back-to-top =====
// A thin top bar that fills as the reader scrolls, plus a back-to-top button
// that appears after scrolling down. Pure presentation, no effect on content
// or crawlability. Lightweight: a single passive scroll listener.
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const height = el.scrollHeight - el.clientHeight;
      const pct = height > 0 ? (scrollTop / height) * 100 : 0;
      setProgress(pct);
      setShowTop(scrollTop > 600);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* progress bar fixed at the very top */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none"
      >
        <div
          className="h-full bg-teal transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* back-to-top button */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="العودة إلى الأعلى"
        className={`fixed bottom-6 left-6 z-40 w-11 h-11 rounded-full bg-teal text-white shadow-soft flex items-center justify-center text-lg transition-all duration-200 ${
          showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <span aria-hidden="true">↑</span>
      </button>
    </>
  );
}
