"use client";
// components/ShukranClient.jsx — post-purchase "order received" page (شكرًا).
//
// Landed on after a successful Snipcart order. The redirect is fired from
// Snipcart.jsx on the `cart.confirmed` event, passing the order token as
// ?token=... so we can show it here. noindex (transient page).
//
// Shows: success check, order number (from token), the 4-stage tracker at
// stage 1, the delivery estimate (8–14 days), and what-happens-next — matching
// the branded order emails so the whole journey feels consistent.

import Link from "next/link";
import { useEffect, useState } from "react";

const AR_DAYS = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const AR_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];
function fmtAr(d) {
  return `${AR_DAYS[d.getDay()]} ${d.getDate()} ${AR_MONTHS[d.getMonth()]}`;
}
function deliveryWindow() {
  const now = new Date();
  const lo = new Date(now); lo.setDate(now.getDate() + 8);
  const hi = new Date(now); hi.setDate(now.getDate() + 14);
  return `${fmtAr(lo)} — ${fmtAr(hi)}`;
}

const STAGES = ["تم الطلب", "قيد التجهيز", "تم الشحن", "تم التسليم"];

function Tracker({ active = 0 }) {
  return (
    <div className="mx-auto mb-8 flex max-w-sm items-start justify-between">
      {STAGES.map((label, i) => {
        const done = i <= active;
        return (
          <div key={label} className="flex flex-1 flex-col items-center">
            <div
              className={`mb-1.5 flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                done ? "bg-teal text-white" : "bg-mint/60 text-ink/40"
              }`}
            >
              {done ? "✓" : i + 1}
            </div>
            <span className={`text-[11px] ${done ? "font-bold text-teal-dark" : "text-ink/40"}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function ShukranClient() {
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    // Snipcart passes the order token on redirect (?token=...). Show a short,
    // friendly reference from it. Falls back gracefully if absent.
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || params.get("order") || "";
    if (token) setOrderId(token.slice(0, 8).toUpperCase());
  }, []);

  return (
    <div className="mx-auto max-w-lg px-5 py-16 text-center">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-mint">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-teal-dark" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>

      <h1 className="mb-3 font-display text-3xl text-ink">شكرًا لطلبك!</h1>
      <p className="mb-2 text-ink/60 leading-relaxed">
        استلمنا طلبك ونعمل عليه الآن. أرسلنا تأكيدًا إلى بريدك الإلكتروني.
      </p>
      {orderId && (
        <p className="mb-8 text-sm text-ink/45">
          رقم الطلب: <span className="font-mono font-bold text-teal-dark">{orderId}</span>
        </p>
      )}
      {!orderId && <div className="mb-8" />}

      <Tracker active={0} />

      <div className="mb-8 rounded-2xl bg-cream p-5 text-right">
        <div className="mb-3 flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-teal" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <span className="text-sm font-bold text-teal-dark">الوصول المتوقّع: {deliveryWindow()}</span>
        </div>
        <ul className="space-y-2 text-sm leading-relaxed text-ink/70">
          <li>• <strong className="text-teal-dark">التجهيز:</strong> يبدأ خلال 1–2 يوم من الآن.</li>
          <li>• <strong className="text-teal-dark">الشحن:</strong> يستغرق 5–8 أيام بعد التجهيز.</li>
          <li>• <strong className="text-teal-dark">التتبّع:</strong> سنرسل لك رقم التتبّع فور شحن طلبك.</li>
        </ul>
      </div>

      <Link
        href="/shop/hisabi/"
        className="inline-block w-full rounded-xl bg-teal py-3 font-medium text-white transition hover:bg-teal-dark"
      >
        متابعة طلباتي
      </Link>
      <div className="mt-4">
        <Link href="/shop/" className="text-sm text-ink/50 hover:underline">
          مواصلة التسوّق
        </Link>
      </div>
    </div>
  );
}
