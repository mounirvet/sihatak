"use client";
// components/Auth/VerifiedClient.jsx — the "email verified" success page body.
//
// Landed on after clicking the confirmation link. Confirms success and offers
// a button to complete the account (name, phone, shipping address). If the
// session didn't establish for some reason, still shows a friendly message
// with a login link.

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider.jsx";

export default function VerifiedClient() {
  const { user, loading } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // give the auth provider a moment to pick up the session from the URL
    const t = setTimeout(() => setChecked(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mx-auto max-w-md px-5 py-20 text-center">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-mint">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-teal-dark" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>

      <h1 className="mb-3 font-display text-3xl text-ink">تم تأكيد بريدك بنجاح</h1>
      <p className="mb-8 text-ink/60 leading-relaxed">
        حسابك مُفعّل الآن. أكمل بياناتك لتسهيل طلباتك وحفظ مفضّلتك عبر أجهزتك.
      </p>

      <Link
        href="/shop/hisabi/"
        className="inline-block w-full rounded-xl bg-teal py-3 font-medium text-white transition hover:bg-teal-dark"
      >
        إكمال بيانات الحساب
      </Link>

      <div className="mt-4">
        <Link href="/shop/" className="text-sm text-ink/50 hover:underline">
          تصفّح المتجر
        </Link>
      </div>

      {checked && !loading && !user && (
        <p className="mt-8 text-sm text-ink/50">
          إن لم تُنقل تلقائيًا،{" "}
          <Link href="/shop/hisabi/" className="text-teal underline">
            سجّل الدخول
          </Link>{" "}
          للمتابعة.
        </p>
      )}
    </div>
  );
}
