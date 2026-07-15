"use client";
// components/Auth/AccountClient.jsx — the /shop/hisabi/ page body.
//
// Logged out -> the auth form.
// Logged in  -> a small account panel: email, link to wishlist, sign out,
//               and account deletion guidance.

import Link from "next/link";
import { useAuth } from "./AuthProvider.jsx";
import AuthForm from "./AuthForm.jsx";
import { useWishlist } from "../../lib/wishlist.js";

export default function AccountClient() {
  const { user, loading, enabled, signOut } = useAuth();
  const { count } = useWishlist();

  if (!enabled) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center">
        <p className="text-ink/70">نظام الحسابات غير مُفعّل حاليًا.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center text-ink/50">
        لحظة…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-5 py-14">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 py-14">
      <h1 className="mb-6 font-display text-3xl text-ink">حسابي</h1>

      <div className="rounded-2xl border border-line bg-cream/60 p-5">
        <p className="text-sm text-ink/55">البريد الإلكتروني</p>
        <p dir="ltr" className="mb-4 text-start font-medium text-ink">
          {user.email}
        </p>

        <Link
          href="/shop/al-mufaddala/"
          className="flex items-center justify-between rounded-xl bg-mint/40 px-4 py-3 text-teal-dark transition hover:bg-mint/60"
        >
          <span>المفضلة</span>
          <span className="rounded-full bg-white px-2.5 py-0.5 text-sm font-bold">
            {count}
          </span>
        </Link>
      </div>

      <button
        onClick={signOut}
        className="mt-4 w-full rounded-xl border border-line py-3 text-ink/70 transition hover:border-coral/40 hover:text-coral"
      >
        تسجيل الخروج
      </button>

      <div className="mt-8 rounded-2xl bg-sand p-4 text-sm leading-relaxed text-ink/60">
        <p className="mb-1 font-medium text-ink/80">حذف الحساب</p>
        <p>
          لحذف حسابك وكل بياناتك المحفوظة نهائيًا، راسلنا من{" "}
          <Link href="/man-nahnu/ittasil-bina/" className="text-teal underline">
            صفحة التواصل
          </Link>{" "}
          وسننفّذ الطلب.
        </p>
      </div>
    </div>
  );
}
