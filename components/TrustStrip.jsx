"use client";
// components/TrustStrip.jsx — conversion trust elements clustered near the CTA.
//
// Three honest, no-fabrication blocks:
//   1. DeliveryEstimate — real dates computed from the product's shipping window.
//   2. PaymentMethods   — the rails GCC shoppers look for (Mada, Visa, MC,
//                         Apple Pay). Static, honest.
//   3. FeatureChips     — scannable trust chips from product.trust_chips
//                         (frontmatter). Hidden if none provided.
//
// No fake stock counts, no countdowns. Everything here is factual.

// ---- delivery date estimate -------------------------------------------------
function fmtAr(date) {
  const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

export function DeliveryEstimate({ minDays, maxDays }) {
  if (!minDays && !maxDays) return null;
  const now = new Date();
  const lo = new Date(now); lo.setDate(now.getDate() + (minDays || 5));
  const hi = new Date(now); hi.setDate(now.getDate() + (maxDays || 8));
  return (
    <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-line bg-cream px-4 py-3">
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-teal" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
      <p className="text-sm text-ink/75">
        اطلب اليوم، ويصلك غالبًا بين{" "}
        <span className="font-bold text-teal-dark">{fmtAr(lo)}</span> و{" "}
        <span className="font-bold text-teal-dark">{fmtAr(hi)}</span>
      </p>
    </div>
  );
}

// ---- payment methods --------------------------------------------------------
export function PaymentMethods() {
  const pill =
    "flex h-7 items-center rounded-md border border-line bg-white px-2 text-[10px] font-bold text-ink/70";
  return (
    <div className="mt-3">
      <p className="mb-1.5 text-[11px] text-ink/45">طرق دفع آمنة ومعتمدة</p>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={pill}>mada</span>
        <span className={pill}>VISA</span>
        <span className={pill}>Mastercard</span>
        <span className={pill}> Pay</span>
        <span className={pill}>STC Pay</span>
      </div>
    </div>
  );
}

// ---- feature trust chips ----------------------------------------------------
export function FeatureChips({ chips }) {
  if (!Array.isArray(chips) || chips.length === 0) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {chips.map((c, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 rounded-full bg-mint/40 px-3 py-1.5 text-xs font-semibold text-teal-dark"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {c}
        </span>
      ))}
    </div>
  );
}
