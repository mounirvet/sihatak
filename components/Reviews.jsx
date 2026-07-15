"use client";
// components/Reviews.jsx — product reviews block on the product page.
//
// - Shows the real average + count (nothing if zero — no fake "0 stars").
// - Lists real reviews with reviewer first name + verified badge.
// - Logged-in users can write/edit/delete their own review.
// - Logged-out users see a prompt to sign in.
// - Injects AggregateRating JSON-LD into <head> once real reviews exist, so
//   Google can show rating stars — legitimately, from real data.

import { useState, useEffect } from "react";
import Link from "next/link";
import { useReviews } from "../lib/reviews.js";
import { useAuth } from "./Auth/AuthProvider.jsx";

function Stars({ value = 0, size = "text-lg", onSet }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span className={`inline-flex ${onSet ? "cursor-pointer" : ""}`}>
      {stars.map((s) => (
        <span
          key={s}
          onClick={onSet ? () => onSet(s) : undefined}
          className={`${size} ${
            s <= Math.round(value) ? "text-coral" : "text-line"
          }`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </span>
  );
}

// Inject/replace the AggregateRating schema in <head>. Runs only when there is
// at least one real review.
function useAggregateSchema(productName, average, count) {
  useEffect(() => {
    const id = "review-aggregate-schema";
    document.getElementById(id)?.remove();
    if (count < 1) return;
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    el.text = JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Product",
      name: productName,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: average,
        reviewCount: count,
        bestRating: 5,
        worstRating: 1,
      },
    });
    document.head.appendChild(el);
    return () => el.remove();
  }, [productName, average, count]);
}

function timeAgo(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("ar", { year: "numeric", month: "long", day: "numeric" });
}

export default function Reviews({ productSlug, productName }) {
  const { enabled, user } = useAuth();
  const authorName = user?.user_metadata?.first_name || null;
  const {
    reviews,
    ready,
    mine,
    submit,
    removeMine,
    count,
    average,
    canReview,
    loggedIn,
  } = useReviews(productSlug);

  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  useAggregateSchema(productName, average, count);

  // If auth isn't configured at all, render nothing (feature simply absent).
  if (!enabled) return null;

  // Prime the form when the user opens it to edit an existing review.
  function openForm() {
    if (mine) {
      setRating(mine.rating);
      setBody(mine.body || "");
    }
    setMsg("");
    setFormOpen(true);
  }

  async function send() {
    if (rating < 1) {
      setMsg("اختر عدد النجوم أولًا.");
      return;
    }
    setBusy(true);
    setMsg("");
    const { error } = await submit({
      rating,
      body,
      authorName,
    });
    setBusy(false);
    if (error) setMsg("تعذّر الحفظ. أعد المحاولة.");
    else {
      setFormOpen(false);
      setMsg("شكرًا لمراجعتك.");
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl text-teal-dark">آراء المشترين</h2>
        {count > 0 && (
          <div className="flex items-center gap-2">
            <Stars value={average} />
            <span className="text-sm text-ink/70">
              {average} ({count})
            </span>
          </div>
        )}
      </div>

      {/* Write / edit CTA */}
      {canReview ? (
        !formOpen && (
          <button
            onClick={openForm}
            className="mb-6 rounded-xl bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-dark"
          >
            {mine ? "تعديل مراجعتك" : "اكتب مراجعة"}
          </button>
        )
      ) : (
        <p className="mb-6 rounded-2xl bg-sand p-4 text-sm text-ink/70">
          <Link href="/shop/hisabi/" className="text-teal underline">
            سجّل الدخول
          </Link>{" "}
          لكتابة مراجعة.
        </p>
      )}

      {/* Form */}
      {formOpen && (
        <div className="mb-6 rounded-2xl border border-line bg-cream/60 p-5">
          <div className="mb-3">
            <label className="mb-1 block text-sm text-ink/70">تقييمك</label>
            <Stars value={rating} size="text-2xl" onSet={setRating} />
          </div>
          <div className="mb-3">
            <label className="mb-1 block text-sm text-ink/70">
              رأيك (اختياري)
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              maxLength={1000}
              className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-ink outline-none focus:border-teal"
              placeholder="ما رأيك في المنتج؟"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={send}
              disabled={busy}
              className="rounded-xl bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-dark disabled:opacity-60"
            >
              {busy ? "…" : "نشر"}
            </button>
            <button
              onClick={() => setFormOpen(false)}
              className="rounded-xl border border-line px-4 py-2 text-sm text-ink/60"
            >
              إلغاء
            </button>
            {mine && (
              <button
                onClick={async () => {
                  await removeMine();
                  setFormOpen(false);
                }}
                className="ms-auto rounded-xl px-4 py-2 text-sm text-coral hover:underline"
              >
                حذف مراجعتي
              </button>
            )}
          </div>
        </div>
      )}

      {msg && !formOpen && (
        <p className="mb-4 text-sm text-teal-dark">{msg}</p>
      )}

      {/* List */}
      {!ready ? (
        <p className="text-sm text-ink/40">لحظة…</p>
      ) : count === 0 ? (
        <p className="text-sm text-ink/50">
          لا مراجعات بعد. كن أوّل من يشارك رأيه.
        </p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-line bg-cream/40 p-4">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-ink">
                    {r.author_name || "مشترٍ"}
                  </span>
                  {r.verified && (
                    <span className="rounded-full bg-mint/60 px-2 py-0.5 text-[11px] text-teal-dark">
                      مشترٍ موثّق ✓
                    </span>
                  )}
                </div>
                <span className="text-xs text-ink/40">{timeAgo(r.created_at)}</span>
              </div>
              <Stars value={r.rating} size="text-sm" />
              {r.body && (
                <p className="mt-2 text-sm leading-relaxed text-ink/80">{r.body}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
