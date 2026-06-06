import Link from 'next/link';
import { SITE, PILLARS } from '../lib/site';

export default function Footer() {
  return (
    <footer className="mt-24 bg-teal-dark text-cream">
      <div className="max-w-6xl mx-auto px-5 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="text-2xl font-display font-bold mb-3">{SITE.name}</div>
          <p className="text-cream/70 leading-relaxed max-w-sm text-sm">
            {SITE.description}
          </p>
        </div>
        <div>
          <h4 className="font-display text-cream mb-3">المحاور</h4>
          <ul className="space-y-2 text-sm">
            {PILLARS.slice(0, 4).map((p) => (
              <li key={p.slug}>
                <Link href={`/mahawir/${p.slug}/`} className="text-cream/70 hover:text-coral">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-cream mb-3">عن المنصة</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/man-nahnu/" className="text-cream/70 hover:text-coral">من نحن</Link></li>
            <li><Link href="/man-nahnu/siyasat-al-tahrir/" className="text-cream/70 hover:text-coral">سياسة التحرير والمراجعة الطبية</Link></li>
            <li><Link href="/man-nahnu/al-masadir/" className="text-cream/70 hover:text-coral">مصادرنا العلمية</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="max-w-6xl mx-auto px-5 py-5 text-xs text-cream/50 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} {SITE.name}. جميع الحقوق محفوظة.</span>
          <span>المحتوى تثقيفي ولا يُغني عن استشارة طبيب الأسنان.</span>
        </div>
      </div>
    </footer>
  );
}
