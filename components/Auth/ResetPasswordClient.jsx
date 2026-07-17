"use client";
// components/Auth/ResetPasswordClient.jsx — the page a user lands on after
// clicking the reset link in their email. Supabase puts them in a temporary
// recovery session; here they type + confirm a new password, and we save it.

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase } from "../../lib/supabaseClient.js";
import { passwordChecks, passwordValid } from "../../lib/passwordRules.js";

export default function ResetPasswordClient() {
  const [ready, setReady] = useState(false);   // recovery session detected?
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    // If arriving via the email link, Supabase emits PASSWORD_RECOVERY and
    // establishes a temporary session that lets updateUser change the password.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    // also check if a session already exists (link processed before listener)
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) setReady(true);
    });
    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  async function onSubmit() {
    setError("");
    if (!passwordValid(pw)) {
      setError("كلمة المرور لا تحقّق الشروط بالأسفل.");
      return;
    }
    if (pw !== pw2) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }
    setBusy(true);
    const supabase = getSupabase();
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) {
      setError("تعذّر تحديث كلمة المرور. قد تكون صلاحية الرابط انتهت — اطلب رابطًا جديدًا.");
      return;
    }
    setDone(true);
  }

  const checks = passwordChecks(pw);
  const inputCls =
    "w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink outline-none focus:border-teal";

  if (done) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-mint">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-teal-dark" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <h1 className="mb-3 font-display text-3xl text-ink">تم تحديث كلمة المرور</h1>
        <p className="mb-8 text-ink/60">يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.</p>
        <Link href="/shop/hisabi/" className="inline-block w-full rounded-xl bg-teal py-3 font-medium text-white hover:bg-teal-dark">
          الذهاب إلى حسابي
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="mb-2 text-center font-display text-3xl text-ink">تعيين كلمة مرور جديدة</h1>
      <p className="mb-8 text-center text-ink/60">اختر كلمة مرور جديدة لحسابك.</p>

      {!ready ? (
        <div className="rounded-xl border border-line bg-cream p-5 text-center text-sm text-ink/70">
          جارٍ التحقّق من رابط إعادة التعيين… إن لم تصل من رابط البريد،{" "}
          <Link href="/shop/hisabi/" className="text-teal underline">اطلب رابطًا جديدًا</Link>.
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-ink/70">كلمة المرور الجديدة</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                dir="ltr"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className={`${inputCls} pe-11`}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label="إظهار/إخفاء" className="absolute inset-y-0 end-3 flex items-center text-ink/40 hover:text-ink/70">
                {show ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            <ul className="mt-2 space-y-1 text-xs">
              <li className={checks.length ? "text-teal" : "text-ink/40"}>٨ أحرف على الأقل</li>
              <li className={checks.letter ? "text-teal" : "text-ink/40"}>حرف واحد على الأقل</li>
              <li className={checks.number ? "text-teal" : "text-ink/40"}>رقم واحد على الأقل</li>
            </ul>
          </div>

          <div>
            <label className="mb-1 block text-sm text-ink/70">تأكيد كلمة المرور</label>
            <input
              type={show ? "text" : "password"}
              dir="ltr"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              className={inputCls}
              placeholder="••••••••"
            />
            {pw2.length > 0 && pw2 !== pw && (
              <p className="mt-1 text-xs text-coral">كلمتا المرور غير متطابقتين.</p>
            )}
          </div>

          {error && <p className="text-sm text-coral">{error}</p>}

          <button
            type="button"
            onClick={onSubmit}
            disabled={busy}
            className="w-full rounded-xl bg-teal py-3 font-medium text-white transition hover:bg-teal-dark disabled:opacity-60"
          >
            {busy ? "جارٍ الحفظ…" : "حفظ كلمة المرور الجديدة"}
          </button>
        </div>
      )}
    </div>
  );
}
