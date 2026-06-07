import Link from 'next/link';
import { SITE_EN, PILLARS_EN } from '../lib/siteEn';

export default function FooterEn() {
  return (
    <footer className="mt-24 bg-teal-dark text-cream" dir="ltr">
      <div className="max-w-6xl mx-auto px-5 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="text-2xl font-display font-bold mb-3">{SITE_EN.name}</div>
          <p className="text-cream/70 leading-relaxed max-w-sm text-sm">
            {SITE_EN.description}
          </p>
        </div>
        <div>
          <h4 className="font-display text-cream mb-3">Topics</h4>
          <ul className="space-y-2 text-sm">
            {PILLARS_EN.slice(0, 4).map((p) => (
              <li key={p.slug}>
                <Link href={`/en/articles/`} className="text-cream/70 hover:text-coral">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-cream mb-3">About</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/en/about/" className="text-cream/70 hover:text-coral">About Asnanik</Link></li>
            <li><Link href="/" className="text-cream/70 hover:text-coral">النسخة العربية</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="max-w-6xl mx-auto px-5 py-5 text-cream/50 text-xs">
          © {new Date().getFullYear()} {SITE_EN.name}. Educational content, not a substitute for professional dental advice.
        </div>
      </div>
    </footer>
  );
}
