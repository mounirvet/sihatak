"use client";
// components/Auth/AccountClient.jsx — the /shop/hisabi/ page body.
//
// Logged out -> the auth form.
// Logged in  -> account panel: name (editable), email, wishlist link,
//               order tracking (via Snipcart), sign out, delete-account note.
//
// ORDERS: order history lives in Snipcart, not Supabase. The "طلباتي" button
// carries Snipcart's `snipcart-customer-signin` class, which opens Snipcart's
// own customer area (order history + tracking) once customer accounts are
// enabled in the Snipcart dashboard. This is a separate login from the
// Supabase account — same person, matched by email.

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider.jsx";
import AuthForm from "./AuthForm.jsx";
import { useWishlist } from "../../lib/wishlist.js";

function fullName(user) {
  const f = user?.user_metadata?.first_name;
  const l = user?.user_metadata?.family_name;
  if (f || l) return [f, l].filter(Boolean).join(" ");
  return null;
}

export default function AccountClient() {
  const { user, loading, enabled, signOut, updateProfile } = useAuth();
  const { count } = useWishlist();

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

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

  const name = fullName(user);

  function startEdit() {
    setFirstName(user.user_metadata?.first_name || "");
    setFamilyName(user.user_metadata?.family_name || "");
    setSavedMsg("");
    setEditing(true);
  }

  async function saveName() {
    setSaving(true);
    setSavedMsg("");
    const { error } = await updateProfile({ firstName, familyName });
    setSaving(false);
    if (error) setSavedMsg("تعذّر الحفظ. أعد المحاولة.");
    else {
      setSavedMsg("تم الحفظ.");
      setEditing(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-ink outline-none focus:border-teal";

  return (
    <div className="mx-auto max-w-md px-5 py-14">
      <h1 className="mb-6 font-display text-3xl text-ink">حسابي</h1>

      <div className="rounded-2xl border border-line bg-cream/60 p-5">
        {/* Name */}
        {!editing ? (
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-sm text-ink/55">الاسم</p>
              <p className="font-medium text-ink">
                {name || <span className="text-ink/40">لم يُضَف بعد</span>}
              </p>
            </div>
            <button
              onClick={startEdit}
              className="text-sm text-teal hover:underline"
            >
              {name ? "تعديل" : "إضافة"}
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm text-ink/70">الاسم</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-ink/70">
                  اسم العائلة
                </label>
                <input
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={saveName}
                disabled={saving}
                className="rounded-xl bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-dark disabled:opacity-60"
              >
                {saving ? "…" : "حفظ"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="rounded-xl border border-line px-4 py-2 text-sm text-ink/60"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}

        {savedMsg && (
          <p className="mb-3 text-sm text-teal-dark">{savedMsg}</p>
        )}

        {/* Email */}
        <div className="mb-4">
          <p className="text-sm text-ink/55">البريد الإلكتروني</p>
          <p dir="ltr" className="text-start font-medium text-ink">
            {user.email}
          </p>
        </div>

        {/* Wishlist */}
        <Link
          href="/shop/al-mufaddala/"
          className="mb-2 flex items-center justify-between rounded-xl bg-mint/40 px-4 py-3 text-teal-dark transition hover:bg-mint/60"
        >
          <span>المفضلة</span>
          <span className="rounded-full bg-white px-2.5 py-0.5 text-sm font-bold">
            {count}
          </span>
        </Link>

        {/* Orders — opens Snipcart's customer area (order history + tracking) */}
        <button
          type="button"
          className="snipcart-customer-signin flex w-full items-center justify-between rounded-xl bg-sand px-4 py-3 text-ink/80 transition hover:bg-sand/70"
        >
          <span>طلباتي وتتبّع الشحن</span>
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
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
