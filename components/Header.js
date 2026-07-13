'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SITE, NAV } from '../lib/site';
import { IconSearch, IconMenu, IconClose } from './Icons';
import WishlistLink from './WishlistLink.jsx';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0" onClick={() => setOpen(false)}>
          <span className="text-2xl font-display font-bold text-teal tracking-tight">
            {SITE.name}
          </span>
          <span className="hidden sm:inline text-xs text-teal-light border-r border-line pr-2 mr-1">
            صحة الأسنان والفم
          </span>
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-ink hover:text-teal rounded-md hover:bg-mint/50 transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/bahth/"
            aria-label="بحث"
            className="ml-1 w-9 h-9 flex items-center justify-center text-ink hover:text-teal rounded-md hover:bg-mint/50 transition-colors"
          >
            <IconSearch className="w-5 h-5" />
          </Link>
          <WishlistLink />
        </nav>

        {/* Mobile controls — search + hamburger, shown only on mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <Link
            href="/bahth/"
            aria-label="بحث"
            className="w-10 h-10 flex items-center justify-center text-ink hover:text-teal rounded-md hover:bg-mint/50 transition-colors"
            onClick={() => setOpen(false)}
          >
            <IconSearch className="w-5 h-5" />
          </Link>
          <WishlistLink />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={open}
            className="w-10 h-10 flex items-center justify-center text-ink hover:text-teal rounded-md hover:bg-mint/50 transition-colors"
          >
            {open ? <IconClose className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <nav className="md:hidden border-t border-line bg-cream">
          <div className="max-w-6xl mx-auto px-5 py-2 flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 px-2 text-base font-medium text-ink hover:text-teal border-b border-line/60 last:border-0 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
