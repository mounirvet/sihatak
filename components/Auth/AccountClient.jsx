"use client";
// components/Auth/AccountClient.jsx — the /shop/hisabi/ page body.
//
// Logged out -> the auth form.
// Logged in  -> sections: personal details (name/phone/gender, email read-only),
//               shipping address (saved for reference), wishlist link,
//               orders (Snipcart), sign out, delete-account note.
//
// Personal details are user metadata (updateProfile). The address lives in the
// Supabase `addresses` table via useAddress(). Orders live in Snipcart.

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider.jsx";
import AuthForm from "./AuthForm.jsx";
import { useWishlist } from "../../lib/wishlist.js";
import OrderHistory from "./OrderHistory.jsx";
import { useAddress, EMPTY_ADDRESS } from "../../lib/address.js";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-ink outline-none focus:border-teal";

const GENDERS = [
  { v: "male", l: "ذكر" },
  { v: "female", l: "أنثى" },
  { v: "", l: "غير محدّد" },
];

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-ink/70">{label}</label>
      {children}
    </div>
  );
}

// ---- Personal details (name + phone + gender; email read-only) ----
function PersonalDetails({ user, updateProfile }) {
  const m = user.user_metadata || {};
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(m.first_name || "");
  const [familyName, setFamilyName] = useState(m.family_name || "");
  const [phone, setPhone] = useState(m.phone || "");
  const [gender, setGender] = useState(m.gender || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const name = [m.first_name, m.family_name].filter(Boolean).join(" ");
  const genderLabel = GENDERS.find((g) => g.v === m.gender)?.l;

  async function save() {
    setSaving(true);
    setMsg("");
    const { error } = await updateProfile({
      firstName,
      familyName,
      phone,
      gender,
    });
    setSaving(false);
    if (error) setMsg("تعذّر الحفظ. أعد المحاولة.");
    else {
      setMsg("تم الحفظ.");
      setEditing(false);
    }
  }

  return (
    <section className="rounded-2xl border border-line bg-cream/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg text-ink">المعلومات الشخصية</h2>
        {!editing && (
          <button
            onClick={() => {
              setMsg("");
              setEditing(true);
            }}
            className="text-sm text-teal hover:underline"
          >
            {name ? "تعديل" : "إضافة"}
          </button>
        )}
      </div>

      {!editing ? (
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-ink/55">الاسم</dt>
            <dd className="font-medium text-ink">
              {name || <span className="text-ink/40">لم يُضَف بعد</span>}
            </dd>
          </div>
          <div>
            <dt className="text-ink/55">البريد الإلكتروني</dt>
            <dd dir="ltr" className="text-start font-medium text-ink">
              {user.email}
            </dd>
          </div>
          <div>
            <dt className="text-ink/55">رقم الهاتف</dt>
            <dd dir="ltr" className="text-start font-medium text-ink">
              {m.phone || <span className="text-ink/40">—</span>}
            </dd>
          </div>
          <div>
            <dt className="text-ink/55">الجنس</dt>
            <dd className="font-medium text-ink">
              {genderLabel || <span className="text-ink/40">—</span>}
            </dd>
          </div>
        </dl>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="الاسم">
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="اسم العائلة">
              <input
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="البريد الإلكتروني (لا يمكن تغييره هنا)">
            <input
              value={user.email}
              readOnly
              dir="ltr"
              className={`${inputCls} cursor-not-allowed bg-sand text-ink/50`}
            />
          </Field>
          <Field label="رقم الهاتف">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              dir="ltr"
              className={inputCls}
              placeholder="+9715XXXXXXXX"
            />
          </Field>
          <Field label="الجنس">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={inputCls}
            >
              {GENDERS.map((g) => (
                <option key={g.l} value={g.v}>
                  {g.l}
                </option>
              ))}
            </select>
          </Field>
          <div className="flex gap-2">
            <button
              onClick={save}
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

      {msg && <p className="mt-3 text-sm text-teal-dark">{msg}</p>}
    </section>
  );
}

// ---- Shipping address (Supabase addresses table) ----
function ShippingAddress() {
  const { address, ready, exists, save } = useAddress();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(EMPTY_ADDRESS);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  function startEdit() {
    setForm(address);
    setMsg("");
    setEditing(true);
  }

  async function submit() {
    setSaving(true);
    setMsg("");
    const { error } = await save(form);
    setSaving(false);
    if (error) setMsg("تعذّر الحفظ. أعد المحاولة.");
    else {
      setMsg("تم الحفظ.");
      setEditing(false);
    }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const hasAny = Object.values(address).some((v) => v);

  return (
    <section className="rounded-2xl border border-line bg-cream/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg text-ink">عنوان الشحن</h2>
        {!editing && ready && (
          <button
            onClick={startEdit}
            className="text-sm text-teal hover:underline"
          >
            {hasAny ? "تعديل" : "إضافة"}
          </button>
        )}
      </div>

      {!ready ? (
        <p className="text-sm text-ink/40">لحظة…</p>
      ) : !editing ? (
        hasAny ? (
          <address className="not-italic text-sm leading-relaxed text-ink">
            <div className="font-medium">{address.full_name}</div>
            <div dir="ltr" className="text-start text-ink/70">
              {address.phone}
            </div>
            <div className="mt-1 text-ink/80">
              {[address.street, address.city, address.region, address.country]
                .filter(Boolean)
                .join("، ")}
              {address.postal_code ? ` — ${address.postal_code}` : ""}
            </div>
          </address>
        ) : (
          <p className="text-sm text-ink/40">
            لم يُضَف عنوان بعد. يُحفظ للرجوع إليه فقط.
          </p>
        )
      ) : (
        <div className="space-y-3">
          <Field label="الاسم الكامل">
            <input value={form.full_name} onChange={set("full_name")} className={inputCls} />
          </Field>
          <Field label="رقم الهاتف">
            <input value={form.phone} onChange={set("phone")} dir="ltr" className={inputCls} placeholder="+9715XXXXXXXX" />
          </Field>
          <Field label="العنوان / الشارع">
            <input value={form.street} onChange={set("street")} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="المدينة">
              <input value={form.city} onChange={set("city")} className={inputCls} />
            </Field>
            <Field label="المنطقة / الإمارة">
              <input value={form.region} onChange={set("region")} className={inputCls} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="الدولة">
              <input value={form.country} onChange={set("country")} className={inputCls} />
            </Field>
            <Field label="الرمز البريدي">
              <input value={form.postal_code} onChange={set("postal_code")} dir="ltr" className={inputCls} />
            </Field>
          </div>
          <div className="flex gap-2">
            <button
              onClick={submit}
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

      {msg && <p className="mt-3 text-sm text-teal-dark">{msg}</p>}
      <p className="mt-3 text-xs text-ink/40">
        يُحفظ العنوان للرجوع إليه؛ ستُدخله عند إتمام الطلب كالمعتاد.
      </p>
    </section>
  );
}

export default function AccountClient() {
  const { user, loading, enabled, signOut, updateProfile } = useAuth();
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
    <div className="mx-auto max-w-md space-y-4 px-5 py-14">
      <h1 className="mb-2 font-display text-3xl text-ink">حسابي</h1>

      <PersonalDetails user={user} updateProfile={updateProfile} />
      <ShippingAddress />

      {/* Wishlist */}
      <section className="rounded-2xl border border-line bg-cream/60 p-5">
        <Link
          href="/shop/al-mufaddala/"
          className="flex items-center justify-between rounded-xl bg-mint/40 px-4 py-3 text-teal-dark transition hover:bg-mint/60"
        >
          <span>المفضلة</span>
          <span className="rounded-full bg-white px-2.5 py-0.5 text-sm font-bold">
            {count}
          </span>
        </Link>
      </section>

      {/* Orders — our own history, matched by email so guest orders appear too */}
      <OrderHistory />

      <button
        onClick={signOut}
        className="w-full rounded-xl border border-line py-3 text-ink/70 transition hover:border-coral/40 hover:text-coral"
      >
        تسجيل الخروج
      </button>

      <div className="rounded-2xl bg-sand p-4 text-sm leading-relaxed text-ink/60">
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
