import { getReviewer } from '../lib/reviewers';

// ===== Medical reviewer byline — visible trust signal =====
export function ReviewerByline({ reviewerId, date, updated }) {
  const r = getReviewer(reviewerId);
  return (
    <div className="flex items-start gap-3 bg-cream border border-line rounded-lg p-4 my-6">
      <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center text-teal shrink-0">
        ✓
      </div>
      <div className="text-sm">
        <div className="text-ink">
          راجَعَه طبياً <strong className="text-teal-dark">{r.name}</strong>
        </div>
        <div className="text-ink/60">{r.credentials}</div>
        <div className="text-ink/50 mt-1 text-xs">
          آخر مراجعة: {updated || date}
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

// ===== FAQ section — mirrors the FAQPage schema =====
export function FAQ({ items }) {
  if (!items || !items.length) return null;
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-display mb-4 text-ink">أسئلة شائعة</h2>
      <div>
        {items.map((f, i) => (
          <div key={i} className="faq-item">
            <div className="faq-q">{f.q}</div>
            <p className="text-ink/80 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ===== Sources — cite authoritative bodies (WHO, AAPD...) =====
export function Sources({ items }) {
  if (!items || !items.length) return null;
  return (
    <section className="mt-12 bg-cream border border-line rounded-lg p-5">
      <h2 className="text-lg font-display mb-3 text-ink">المصادر العلمية</h2>
      <ol className="space-y-2 text-sm text-ink/70 list-decimal pr-5">
        {items.map((s, i) => (
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
        ))}
      </ol>
    </section>
  );
}
