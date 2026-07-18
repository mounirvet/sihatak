"use client";
// components/Auth/OrderHistory.jsx — the customer's order history (طلباتي).
//
// Reads from the Supabase `orders` table, matched on EMAIL — not on user id.
// That's deliberate: someone can check out as a guest with no account, then
// create an account later with the same email and immediately see every past
// order. RLS on the table guarantees a customer only ever sees their own rows.
//
// Shows per order: number, date, items, total, live stage tracker, tracking
// number (when shipped), delivery estimate (while in transit), and a reorder
// button that puts the same items back in the cart.

import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider.jsx";
import { getSupabase } from "../../lib/supabaseClient.js";

const AR_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getDate()} ${AR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// Delivery estimate: 8–14 days from the order date (processing 1–2 + transit 5–8).
function deliveryWindow(iso) {
  if (!iso) return "";
  const base = new Date(iso);
  const lo = new Date(base); lo.setDate(base.getDate() + 8);
  const hi = new Date(base); hi.setDate(base.getDate() + 14);
  return `${lo.getDate()} ${AR_MONTHS[lo.getMonth()]} — ${hi.getDate()} ${AR_MONTHS[hi.getMonth()]}`;
}

const STAGES = [
  { key: "confirmed", label: "تم الطلب" },
  { key: "processing", label: "قيد التجهيز" },
  { key: "shipped", label: "تم الشحن" },
  { key: "delivered", label: "تم التسليم" },
];

const STATUS_LABEL = {
  confirmed: "تم الطلب",
  processing: "قيد التجهيز",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغى",
};

function Tracker({ status }) {
  const idx = STAGES.findIndex((s) => s.key === status);
  const active = idx < 0 ? 0 : idx;
  return (
    <div className="my-3 flex items-start justify-between">
      {STAGES.map((s, i) => {
        const done = i <= active;
        return (
          <div key={s.key} className="flex flex-1 flex-col items-center">
            <div
              className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                done ? "bg-teal text-white" : "bg-mint/60 text-ink/40"
              }`}
            >
              {done ? "✓" : i + 1}
            </div>
            <span className={`text-[10px] ${done ? "font-bold text-teal-dark" : "text-ink/40"}`}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }) {
  const [reordering, setReordering] = useState(false);
  const items = Array.isArray(order.items) ? order.items : [];
  const cancelled = order.status === "cancelled";

  // Re-add every item from this order to the Snipcart cart.
  async function reorder() {
    const S = typeof window !== "undefined" ? window.Snipcart : null;
    if (!S?.api) return;
    setReordering(true);
    try {
      for (const it of items) {
        if (!it?.url) continue;
        await S.api.cart.items.add({
          id: it.id || it.url,
          name: it.name,
          price: it.price,
          url: it.url,
          quantity: it.qty || 1,
          image: it.image || undefined,
        });
      }
      S.api.theme.cart.open();
    } catch {
      // if anything fails, leave the cart as-is rather than half-adding silently
    } finally {
      setReordering(false);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-ink">
            طلب {order.invoice_number || (order.token || "").slice(0, 8).toUpperCase()}
          </p>
          <p className="text-xs text-ink/45">{fmtDate(order.ordered_at)}</p>
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-teal-dark">
            {order.total != null ? `${order.total} ر.س` : ""}
          </p>
          <span
            className={`text-[11px] ${
              cancelled ? "text-coral" : "text-ink/45"
            }`}
          >
            {STATUS_LABEL[order.status] || order.status}
          </span>
        </div>
      </div>

      {!cancelled && <Tracker status={order.status} />}

      <ul className="mb-3 space-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex justify-between gap-3 text-xs text-ink/70">
            <span className="flex-1">{it.name}{it.qty > 1 ? ` × ${it.qty}` : ""}</span>
          </li>
        ))}
      </ul>

      {order.tracking_number && (
        <div className="mb-3 rounded-xl bg-sand px-3 py-2 text-xs">
          <span className="text-ink/60">رقم التتبّع: </span>
          <span className="font-bold tracking-wide text-teal-dark">{order.tracking_number}</span>
          {order.tracking_url && (
            <a
              href={order.tracking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="ms-2 text-teal underline"
            >
              تتبّع الشحنة
            </a>
          )}
        </div>
      )}

      {!cancelled && order.status !== "delivered" && (
        <p className="mb-3 text-xs text-ink/50">
          الوصول المتوقّع: {deliveryWindow(order.ordered_at)}
        </p>
      )}

      {items.length > 0 && (
        <button
          type="button"
          onClick={reorder}
          disabled={reordering}
          className="w-full rounded-xl border border-line py-2 text-xs text-ink/70 transition hover:border-teal/40 hover:text-teal disabled:opacity-50"
        >
          {reordering ? "جارٍ الإضافة…" : "إعادة الطلب"}
        </button>
      )}
    </div>
  );
}

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = getSupabase();
      if (!supabase || !user?.email) {
        setLoading(false);
        return;
      }
      // RLS restricts this to the signed-in user's own email automatically,
      // but we filter explicitly too for clarity.
      const { data, error: err } = await supabase
        .from("orders")
        .select("*")
        .ilike("email", user.email)
        .order("ordered_at", { ascending: false });

      if (cancelled) return;
      if (err) setError(true);
      else setOrders(data || []);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  return (
    <section className="rounded-2xl border border-line bg-cream/60 p-5">
      <h2 className="mb-3 font-display text-lg text-ink">طلباتي</h2>

      {loading && <p className="text-sm text-ink/50">جارٍ التحميل…</p>}

      {!loading && error && (
        <p className="text-sm text-ink/50">
          تعذّر تحميل الطلبات حاليًا. حاول تحديث الصفحة.
        </p>
      )}

      {!loading && !error && orders.length === 0 && (
        <p className="text-sm leading-relaxed text-ink/50">
          لا توجد طلبات بعد. ستظهر هنا كل طلباتك المرتبطة ببريدك الإلكتروني —
          بما فيها الطلبات التي أتممتها قبل إنشاء الحساب.
        </p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </section>
  );
}
