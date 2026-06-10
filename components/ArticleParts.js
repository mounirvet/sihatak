import Link from 'next/link';
import { getReviewer } from '../lib/reviewers';
import { IconCheck, IconArrowL } from './Icons';
import { LINK_MAP } from '../lib/autolink';

// Format an ISO date (YYYY-MM-DD) as a readable Arabic date, e.g. "7 يونيو 2026".
const AR_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];
function formatArabicDate(iso) {
  if (!iso) return '';
  const [y, m, d] = String(iso).split('-').map((n) => parseInt(n, 10));
  if (!y || !m || !d) return iso;
  return `${d} ${AR_MONTHS[m - 1]} ${y}`;
}

// ===== Medical reviewer byline — visible trust + freshness signal =====
export function ReviewerByline({ reviewerId, date, updated }) {
  const r = getReviewer(reviewerId);
  const reviewedDate = updated || date;
  const showPublished = date && updated && date !== updated;
  return (
    <div className="flex items-start gap-3 bg-cream border border-line rounded-lg p-4 my-6">
      <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center text-teal shrink-0">
        <IconCheck className="w-5 h-5" />
      </div>
      <div className="text-sm">
        <div className="text-ink">
          راجَعَه طبياً{' '}
          <Link href={r.url || '/man-nahnu/al-fariq-al-tibbi/'} className="text-teal-dark font-bold hover:underline">
            {r.name}
          </Link>
        </div>
        <div className="text-ink/60">{r.credentials}</div>
        <div className="text-ink/50 mt-1 text-xs">
          آخر مراجعة طبية:{' '}
          <time dateTime={reviewedDate}>{formatArabicDate(reviewedDate)}</time>
          {showPublished && (
            <>
              {' '}· نُشر في <time dateTime={date}>{formatArabicDate(date)}</time>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== The answer block — first thing after H1, what AI extracts =====
export function AnswerBlock({ children }) {
  return (
    <div className="answer-block">
      <span className="block text-xs font-bold text-teal-dark mb-1 tracking-wide">
        الإجابة المختصرة
      </span>
      {children}
    </div>
  );
}

// ===== Key takeaways — a scannable bullet summary near the top of long
// articles. These short, self-contained points are exactly the chunks that
// AI answer engines and skimming readers extract, complementing the prose
// answer block above. Renders only when takeaways are provided.
export function KeyTakeaways({ items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <section
      aria-label="أبرز النقاط"
      className="my-6 bg-mint/30 border border-mint rounded-xl p-5"
    >
      <h2 className="text-base font-display text-ink mb-3">أبرز النقاط</h2>
      <ul className="space-y-2 text-ink/85 text-sm leading-relaxed list-disc pr-5 mb-0">
        {items.map((t, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: t }} />
        ))}
      </ul>
    </section>
  );
}

// ===== FAQ section — mirrors the FAQPage schema =====
// Each question may auto-link to the article that best covers it (a contextual
// "اقرأ المزيد" link), reusing the autolink LINK_MAP so there is no new data to
// maintain and no separate pages are created. The link is shown only when a
// confident topic match is found, and never points the article at itself.
function findReadMore(question, currentSlug) {
  if (!question) return null;
  // Longest terms first so the most specific topic wins (mirrors autolink).
  const sorted = [...LINK_MAP].sort((a, b) => b.term.length - a.term.length);
  for (const entry of sorted) {
    if (entry.slug === currentSlug) continue; // never self-link
    if (entry.term.length < 6) continue; // skip very short/ambiguous terms
    if (question.includes(entry.term)) {
      const base = entry.type === 'insight' ? '/jadeed' : '/maqalat';
      return { href: `${base}/${entry.slug}/`, term: entry.term };
    }
  }
  return null;
}

export function FAQ({ items, currentSlug }) {
  if (!items || !items.length) return null;
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-display mb-4 text-ink">أسئلة شائعة</h2>
      <div>
        {items.map((f, i) => {
          const more = findReadMore(f.q, currentSlug);
          return (
            <div key={i} className="faq-item">
              <div className="faq-q">{f.q}</div>
              <p className="text-ink/80 leading-relaxed">{f.a}</p>
              {more && (
                <Link
                  href={more.href}
                  className="inline-flex items-center gap-1 text-teal text-sm font-medium hover:text-teal-dark hover:underline mt-1 print:hidden"
                >
                  اقرأ المزيد <IconArrowL className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ===== Sources — cite authoritative bodies (WHO, AAPD...) =====
// Supports BOTH a plain string ("ADA — Implants") and an object
// ({ title, url, publisher }). All current content stores plain strings,
// so the string branch is what makes the المصادر العلمية list show text.
export function Sources({ items }) {
  if (!items || !items.length) return null;
  return (
    <section className="mt-12 bg-cream border border-line rounded-lg p-5">
      <h2 className="text-lg font-display mb-3 text-ink">المصادر العلمية</h2>
      <ol className="space-y-2 text-sm text-ink/70 list-decimal pr-5">
        {items.map((s, i) => {
          if (typeof s === 'string') {
            return <li key={i}>{s}</li>;
          }
          return (
            <li key={i}>
              {s.url ? (
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-teal underline underline-offset-2">
                  {s.title}
                </a>
              ) : (
                s.title
              )}
              {s.publisher && <span className="text-ink/50"> — {s.publisher}</span>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
