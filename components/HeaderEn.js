import Link from 'next/link';
import { SITE_EN, NAV_EN } from '../lib/siteEn';

export default function HeaderEn() {
  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-line" dir="ltr">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/en/" className="flex items-center gap-2 group">
          <span className="text-2xl font-display font-bold text-teal tracking-tight">
            {SITE_EN.name}
          </span>
          <span className="hidden sm:inline text-xs text-teal-light border-l border-line pl-2 ml-1">
            Dental &amp; Oral Health
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_EN.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-ink hover:text-teal rounded-md hover:bg-mint/50 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {/* Language switch to Arabic home */}
          <Link
            href="/"
            className="px-3 py-2 text-sm font-medium text-teal border border-line rounded-md hover:bg-mint/50 transition-colors mr-1"
          >
            العربية
          </Link>
        </nav>
      </div>
    </header>
  );
}
