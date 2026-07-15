"use client";
// components/Auth/AuthForm.jsx — email + password signup / login / reset.
//
// Three modes (login | signup | reset). Arabic throughout. Supabase errors are
// mapped to friendly Arabic messages.
//
// Signup now also collects first + family name (both required) and shows a live
// password checklist. The same password rule is enforced server-side in
// Supabase, so the checklist is UX, not the security boundary.

import { useState } from "react";
import { useAuth } from "./AuthProvider.jsx";
import {
  passwordChecks,
  passwordValid,
  PASSWORD_RULE_LABELS,
} from "../../lib/passwordRules.js";

const MODES = { LOGIN: "login", SIGNUP: "signup", RESET: "reset" };

function friendlyError(msg = "") {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  if (m.includes("already registered")) return "هذا البريد مسجّل بالفعل. جرّب تسجيل الدخول.";
  if (m.includes("password should be at least") || m.includes("weak"))
    return "كلمة المرور لا تحقّق الشروط المطلوبة.";
  if (m.includes("email not confirmed"))
    return "لم يُؤكَّد بريدك بعد. افتح رسالة التأكيد في بريدك أولًا.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "محاولات كثيرة. انتظر قليلًا ثم أعد المحاولة.";
  return "حدث خطأ. تحقّق من بياناتك وأعد المحاولة.";
}

function PasswordChecklist({ password }) {
  const c = passwordChecks(password);
  const keys = ["length", "letter", "number"];
  return (
    <ul className="mt-2 space-y-1">
      {keys.map((k) => (
        <li
          key={k}
          className={`flex items-center gap-2 text-xs ${
            c[k] ? "text-teal-dark" : "text-ink/45"
          }`}
        >
          <span
            className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
              c[k] ? "bg-mint text-teal-dark" : "bg-line text-ink/40"
            }`}
            aria-hidden="true"
          >
            {c[k] ? "✓" : "•"}
          </span>
          {PASSWORD_RULE_LABELS[k]}
        </li>
      ))}
    </ul>
  );
}

export default function AuthForm({ onSuccess }) {
  const { signIn, signUp, resetPassword, enabled } = useAuth();
  const [mode, setMode] = useState(MODES.LOGIN);
  const [firstName, setFirstName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  function reset() {
    setError("");
    setNotice("");
  }

  async function submit(e) {
    e.preventDefault();
    reset();

    // Client-side guard for signup: names + password rule. Supabase enforces
    // the password rule again server-side regardless.
    if (mode === MODES.SIGNUP) {
      if (!firstName.trim() || !familyName.trim()) {
        setError("يرجى إدخال الاسم واسم العائلة.");
        return;
      }
      if (!passwordValid(password)) {
        setError("كلمة المرور لا تحقّق الشروط المطلوبة بالأسفل.");
        return;
      }
      if (password !== confirmPassword) {
        setError("كلمتا المرور غير متطابقتين.");
        return;
      }
    }

    setBusy(true);
    try {
      if (mode === MODES.LOGIN) {
        const { error } = await signIn(email.trim(), password);
        if (error) setError(friendlyError(error.message));
        else onSuccess?.();
      } else if (mode === MODES.SIGNUP) {
        const { data, error } = await signUp(email.trim(), password, {
          firstName,
          familyName,
        });
        if (error) {
          setError(friendlyError(error.message));
        } else if (data?.user && !data.session) {
          setNotice(
            "أرسلنا رابط تأكيد إلى بريدك. افتحه لتفعيل حسابك ثم سجّل الدخول."
          );
        } else {
          onSuccess?.();
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

  const inputCls =
    "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-ink outline-none focus:border-teal";

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
        {mode === MODES.SIGNUP && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm text-ink/70">الاسم</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputCls}
                placeholder="محمد"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink/70">اسم العائلة</label>
              <input
                type="text"
                required
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className={inputCls}
                placeholder="العبّاس"
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm text-ink/70">البريد الإلكتروني</label>
          <input
            type="email"
            required
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
            placeholder="you@example.com"
          />
        </div>

        {mode !== MODES.RESET && (
          <div>
            <label className="mb-1 block text-sm text-ink/70">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputCls} pe-11`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                className="absolute inset-y-0 end-3 flex items-center text-ink/40 hover:text-ink/70"
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {mode === MODES.SIGNUP && <PasswordChecklist password={password} />}
          </div>
        )}

        {mode === MODES.SIGNUP && (
          <div>
            <label className="mb-1 block text-sm text-ink/70">تأكيد كلمة المرور</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              dir="ltr"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputCls}
              placeholder="••••••••"
            />
            {confirmPassword.length > 0 && confirmPassword !== password && (
              <p className="mt-1 text-xs text-coral">كلمتا المرور غير متطابقتين.</p>
            )}
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
                reset();
              }}
              className="text-teal hover:underline"
            >
              ليس لديك حساب؟ أنشئ واحدًا
            </button>
            <br />
            <button
              onClick={() => {
                setMode(MODES.RESET);
                reset();
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
              reset();
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
              reset();
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
