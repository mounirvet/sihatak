import Link from 'next/link';
import { SITE, NAV } from '../lib/site';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-display font-bold text-teal tracking-tight">
            {SITE.name}
          </span>
          <span className="hidden sm:inline text-xs text-teal-light border-r border-line pr-2 mr-1">
            صحة الأسنان والفم
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-ink hover:text-teal rounded-md hover:bg-mint/50 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/bahth/"
            aria-label="بحث"
            className="ml-1 w-9 h-9 flex items-center justify-center text-ink hover:text-teal rounded-md hover:bg-mint/50 transition-colors"
          >
            <span aria-hidden="true" className="text-lg">🔍</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
