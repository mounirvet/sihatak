"use client";
// components/WishlistClient.jsx — renders the saved-items page from localStorage.

import Link from "next/link";
import { useWishlist } from "../lib/wishlist.js";
import WishlistButton from "./WishlistButton.jsx";

const CURRENCY = "ر.س";

export default function WishlistClient() {
  const { items, count, ready, clear } = useWishlist();

  // Storage hasn't been read yet — show a skeleton rather than flashing the
  // empty state at someone who has 8 saved items.
  if (!ready) {
    return (
      <main dir="rtl" className="mx-auto max-w-6xl px-4 py-10">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-mint/40" />
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-2xl bg-mint/25"
            />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink/60">
        <Link href="/">الرئيسية</Link> <span>/</span>{" "}
        <Link href="/shop/">المتجر</Link> <span>/</span>{" "}
        <span>المفضلة</span>
      </nav>

      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-teal-dark">المفضلة</h1>
          <p className="mt-2 text-ink/70">
            {count > 0
              ? `${count} منتج محفوظ في هذا المتصفّح.`
              : "لم تحفظ أي منتج بعد."}
          </p>
        </div>
        {count > 0 && (
          <button
            type="button"
            onClick={clear}
            className="text-sm text-ink/50 underline underline-offset-2 transition hover:text-coral"
          >
            مسح الكل
          </button>
        )}
      </header>

      {count === 0 ? (
        <div className="rounded-2xl border border-line bg-cream px-6 py-14 text-center">
          <svg
            viewBox="0 0 24 24"
            className="mx-auto h-14 w-14 text-mint"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.8-7.7 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z" />
          </svg>
          <p className="mt-5 text-ink/70">
            اضغط على القلب في أي منتج لحفظه هنا والرجوع إليه لاحقًا.
          </p>
          <Link
            href="/shop/"
            className="mt-6 inline-block rounded-2xl bg-coral px-6 py-3 font-bold text-white transition hover:opacity-90"
          >
            تصفّح المتجر
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => {
              const save =
                p.compare_at_price && p.compare_at_price > p.price
                  ? Math.round((1 - p.price / p.compare_at_price) * 100)
                  : 0;

              return (
                <div key={p.slug} className="relative">
                  <Link
                    href={`/shop/${p.category}/${p.slug}/`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-cream transition hover:-translate-y-1 hover:border-teal hover:shadow-card"
                  >
                    {save > 0 && (
                      <span className="absolute left-3 top-3 z-10 rounded-full bg-coral px-2 py-0.5 text-xs font-bold text-white shadow">
                        -{save}٪
                      </span>
                    )}

                    <div className="flex aspect-square items-center justify-center overflow-hidden bg-white">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image}
                          alt={p.title_ar}
                          width={1200}
                          height={1200}
                          loading="lazy"
                          className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-ink/20">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-12 w-12"
                            fill="currentColor"
                          >
                            <path d="M12 2C8 2 6 5 6 9c0 5 2 13 4 13s2-4 2-4 0 4 2 4 4-8 4-13c0-4-2-7-6-7Z" />
                          </svg>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-3">
                      <h3 className="line-clamp-2 text-sm font-medium leading-snug text-ink group-hover:text-teal">
                        {p.title_ar}
                      </h3>
                      <div className="mt-auto flex items-baseline gap-2 pt-3">
                        <span className="font-display text-lg text-teal-dark">
                          {p.price} {CURRENCY}
                        </span>
                        {save > 0 && (
                          <span className="text-xs text-ink/40 line-through">
                            {p.compare_at_price}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="absolute right-3 top-3 z-20">
                    <WishlistButton product={p} />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-8 rounded-xl border border-line bg-sand/40 px-4 py-3 text-center text-xs text-ink/55">
            المفضلة محفوظة في هذا المتصفّح فقط، ولن تظهر على جهاز آخر. الأسعار قد
            تتغيّر — الصفحة نفسها هي المرجع.
          </p>
        </>
      )}
    </main>
  );
}
