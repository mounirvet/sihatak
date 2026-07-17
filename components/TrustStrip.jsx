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
// Real brand logos (PNG, transparent) live in /public/images/pay/. Only the
// rails the checkout ACTUALLY accepts are shown — Visa, Mastercard, Apple Pay.
// No mada/STC Pay: Snipcart→Stripe doesn't process them here, so showing them
// would be a false trust signal. Logos are height-locked so different aspect
// ratios line up cleanly.
const PAY_METHODS = [
  { src: "/images/pay/visa.png", alt: "Visa" },
  { src: "/images/pay/mastercard.png", alt: "Mastercard" },
  { src: "/images/pay/applepay.png", alt: "Apple Pay" },
];

export function PaymentMethods() {
  return (
    <div className="mt-3">
      <p className="mb-1.5 text-[11px] text-ink/45">طرق دفع آمنة ومعتمدة</p>
      <div className="flex flex-wrap items-center gap-2">
        {PAY_METHODS.map((m) => (
          <span
            key={m.alt}
            className="flex h-9 items-center justify-center rounded-lg border border-line bg-white px-3"
          >
            <img
              src={m.src}
              alt={m.alt}
              className="h-4 w-auto"
              loading="lazy"
              width="40"
              height="16"
            />
          </span>
        ))}
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
