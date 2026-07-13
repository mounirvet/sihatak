"use client";
// components/CartLink.jsx — header cart button.
//
// `snipcart-checkout` opens the cart. `snipcart-items-count` is a Snipcart
// hook class: Snipcart writes the live item count into any element carrying it,
// so we don't manage that state ourselves.
//
// The badge starts hidden and Snipcart reveals it when the cart is non-empty —
// avoids a "0" flashing on every page load before the cart hydrates.

export default function CartLink({ className = "" }) {
  return (
    <button
      type="button"
      className={`snipcart-checkout relative inline-flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition hover:bg-mint/40 hover:text-teal ${className}`}
      aria-label="سلة المشتريات"
      title="سلة المشتريات"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 6h15l-1.5 9h-12z" />
        <path d="M6 6 5 2H2" />
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
      </svg>

      <span className="snipcart-items-count absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold leading-none text-white" />
    </button>
  );
}
