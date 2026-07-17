"use client";
// components/StickyNav.jsx — two scroll-aware helpers for the product page.
//
//   • SectionNav  — a slim jump-link bar (الوصف · المكوّنات · التقييمات · الأسئلة)
//                   that sticks under the header on long pages.
//   • StickyBuyBar— a bottom bar that appears once the main CTA scrolls out of
//                   view, keeping price + buy one tap away. Shows on all sizes.
//
// Both are progressive: they enhance scroll behaviour and never block content.

import { useEffect, useState } from "react";
import BuyButton from "./BuyButton.jsx";

export function SectionNav({ sections }) {
  const [active, setActive] = useState(sections?.[0]?.id);
  useEffect(() => {
    if (!sections?.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  if (!sections?.length) return null;
  return (
    <nav className="sticky top-16 z-20 -mx-4 mb-6 hidden border-y border-line bg-sand/95 px-4 backdrop-blur md:block">
      <div className="mx-auto flex max-w-3xl items-center justify-center gap-1 py-2">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === s.id
                ? "bg-teal-dark text-cream"
                : "text-ink/60 hover:bg-mint/40 hover:text-teal-dark"
            }`}
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function StickyBuyBar({ product, price, currency, buyable, title }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const sentinel = document.getElementById("primary-cta");
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 hidden border-t border-line bg-cream/98 backdrop-blur transition-transform duration-300 md:block ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-ink/60">{title}</p>
          <p className="font-display text-lg font-bold text-teal-dark">
            {price} {currency}
          </p>
        </div>
        <div className="shrink-0">
          <BuyButton
            product={product}
            price={price}
            currency={currency}
            buyable={buyable}
            inStock={product.in_stock}
            showAddToCart={false}
          />
        </div>
      </div>
    </div>
  );
}
