"use client";
// components/Auth/AuthForm.jsx — email + password signup / login / reset.
//
// Three modes in one component (login | signup | reset), toggled by links.
// All copy is Arabic. Errors from Supabase are mapped to friendly Arabic
// messages rather than shown raw.
//
// NOTE ON "confirm email": if that setting is ON in Supabase, a fresh signup
// does NOT log the person in — they must click the emailed link first. We show
// a "check your inbox" panel in that case. If it's OFF, signup logs them in
// immediately and the parent redirects.

import { useState } from "react";
import { useAuth } from "./AuthProvider.jsx";

const MODES = { LOGIN: "login", SIGNUP: "signup", RESET: "reset" };

function friendlyError(msg = "") {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  if (m.includes("already registered")) return "هذا البريد مسجّل بالفعل. جرّب تسجيل الدخول.";
  if (m.includes("password should be at least"))
    return "كلمة المرور قصيرة جدًا (6 أحرف على الأقل).";
  if (m.includes("email not confirmed"))
    return "لم يُؤكَّد بريدك بعد. افتح رسالة التأكيد في بريدك أولًا.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "محاولات كثيرة. انتظر قليلًا ثم أعد المحاولة.";
  return "حدث خطأ. تحقّق من بياناتك وأعد المحاولة.";
}

export default function AuthForm({ onSuccess }) {
  const { signIn, signUp, resetPassword, enabled } = useAuth();
  const [mode, setMode] = useState(MODES.LOGIN);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  if (!enabled) {
    return (
      <p className="rounded-2xl bg-sand p-4 text-center text-sm text-ink/70">
        نظام الحسابات غير مُفعّل حاليًا.
      </p>
    );
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);

    try {
      if (mode === MODES.LOGIN) {
        const { error } = await signIn(email.trim(), password);
        if (error) setError(friendlyError(error.message));
        else onSuccess?.();
      } else if (mode === MODES.SIGNUP) {
        const { data, error } = await signUp(email.trim(), password);
        if (error) {
          setError(friendlyError(error.message));
        } else if (data?.user && !data.session) {
          // confirm-email is ON: no session yet
          setNotice(
            "أرسلنا رابط تأكيد إلى بريدك. افتحه لتفعيل حسابك ثم سجّل الدخول."
          );
        } else {
          onSuccess?.(); // confirm-email OFF: logged in immediately
        }
      } else if (mode === MODES.RESET) {
        const { error } = await resetPassword(email.trim());
        if (error) setError(friendlyError(error.message));
        else
          setNotice(
            "إن كان بريدك مسجّلًا، ستصلك رسالة لإعادة تعيين كلمة المرور."
          );
      }
    } finally {
      setBusy(false);
    }
  }

  const title =
    mode === MODES.LOGIN
      ? "تسجيل الدخول"
      : mode === MODES.SIGNUP
      ? "إنشاء حساب"
      : "إعادة تعيين كلمة المرور";

  const cta =
    mode === MODES.LOGIN
      ? "دخول"
      : mode === MODES.SIGNUP
      ? "إنشاء الحساب"
      : "إرسال الرابط";

  return (
    <div className="mx-auto w-full max-w-sm">
      <h2 className="mb-1 text-center font-display text-2xl text-ink">{title}</h2>
      <p className="mb-6 text-center text-sm text-ink/55">
        {mode === MODES.SIGNUP
          ? "احفظ مفضّلتك وتابعها من أي جهاز."
          : mode === MODES.RESET
          ? "أدخل بريدك وسنرسل لك رابطًا."
          : "أهلًا بعودتك."}
      </p>

      {notice && (
        <p className="mb-4 rounded-2xl bg-mint/50 p-3 text-center text-sm text-teal-dark">
          {notice}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-2xl bg-coral/10 p-3 text-center text-sm text-coral">
          {error}
        </p>
      )}

      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="mb-1 block text-sm text-ink/70">البريد الإلكتروني</label>
          <input
            type="email"
            required
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-ink outline-none focus:border-teal"
            placeholder="you@example.com"
          />
        </div>

        {mode !== MODES.RESET && (
          <div>
            <label className="mb-1 block text-sm text-ink/70">كلمة المرور</label>
            <input
              type="password"
              required
              minLength={6}
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-ink outline-none focus:border-teal"
              placeholder="••••••••"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-teal py-3 font-medium text-white transition hover:bg-teal-dark disabled:opacity-60"
        >
          {busy ? "لحظة…" : cta}
        </button>
      </form>

      <div className="mt-5 space-y-2 text-center text-sm">
        {mode === MODES.LOGIN && (
          <>
            <button
              onClick={() => {
                setMode(MODES.SIGNUP);
                setError("");
                setNotice("");
              }}
              className="text-teal hover:underline"
            >
              ليس لديك حساب؟ أنشئ واحدًا
            </button>
            <br />
            <button
              onClick={() => {
                setMode(MODES.RESET);
                setError("");
                setNotice("");
              }}
              className="text-ink/50 hover:underline"
            >
              نسيت كلمة المرور؟
            </button>
          </>
        )}
        {mode === MODES.SIGNUP && (
          <button
            onClick={() => {
              setMode(MODES.LOGIN);
              setError("");
              setNotice("");
            }}
            className="text-teal hover:underline"
          >
            لديك حساب؟ سجّل الدخول
          </button>
        )}
        {mode === MODES.RESET && (
          <button
            onClick={() => {
              setMode(MODES.LOGIN);
              setError("");
              setNotice("");
            }}
            className="text-teal hover:underline"
          >
            العودة لتسجيل الدخول
          </button>
        )}
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-ink/40">
        بإنشائك حسابًا فإنك توافق على{" "}
        <a
          href="/man-nahnu/siyasat-al-khususiyya/"
          className="underline hover:text-ink/70"
        >
          سياسة الخصوصية
        </a>
        .
      </p>
    </div>
  );
}
