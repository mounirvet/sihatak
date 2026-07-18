// supabase/functions/send-abandoned-carts/index.ts
//
// Abandoned-cart recovery, our own way.
//
// WHY THIS EXISTS: Snipcart has NO `cart.abandoned` webhook. Its order events
// are only order.completed / status.changed / paymentStatus.changed /
// trackingNumber.changed / refund.created / notification.created /
// withdrawal.created. Abandoned carts are only reachable through the REST API:
//   GET https://app.snipcart.com/api/carts/abandoned
// So instead of waiting for an event that never fires, we POLL on a schedule.
//
// SCHEDULE: run this hourly (pg_cron). Each run looks for carts abandoned in
// the target window and emails each one once.
//
// TWO-TOUCH SEQUENCE (chosen deliberately — see README):
//   • Touch 1 — ~4–24h after abandonment: gentle reminder.
//   • Touch 2 — ~24–72h later: final nudge.
// No discount is offered. Training customers to abandon carts for a coupon
// erodes margin, and for a young store it's better to establish full price.
//
// DEDUPE: every send is recorded in `abandoned_cart_emails` with a UNIQUE
// (cart_token, touch) constraint, so a cart can never be emailed twice for the
// same touch even if the schedule overlaps or a run is retried.

import { abandonedCartEmail, sendEmail } from "../_shared/email.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SNIPCART_API_KEY = Deno.env.get("SNIPCART_SECRET_API_KEY");
const SNIPCART_TEST_API_KEY = Deno.env.get("SNIPCART_TEST_SECRET_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Snipcart's supported timeRange values.
const RANGES = {
  touch1: "LessThan1Day",   // covers carts abandoned within the last day
  touch2: "LessThan1Week",  // wider net for the second nudge
} as const;

// Only email carts older than this many hours (gives the customer time to come
// back on their own before we interrupt them).
const TOUCH1_MIN_HOURS = 4;
const TOUCH2_MIN_HOURS = 48;

type Cart = {
  token: string;
  email?: string;
  creationDate?: string;
  modificationDate?: string;
  items?: any[];
  billingAddressName?: string;
  [k: string]: unknown;
};

function authHeader(key: string) {
  return {
    Accept: "application/json",
    Authorization: `Basic ${btoa(key + ":")}`,
  };
}

// Fetch every abandoned cart in a time range, following continuationToken.
async function fetchAbandoned(key: string, timeRange: string): Promise<Cart[]> {
  const out: Cart[] = [];
  let continuation: string | null = null;
  let guard = 0;

  do {
    const url = new URL("https://app.snipcart.com/api/carts/abandoned");
    url.searchParams.set("limit", "50");
    url.searchParams.set("timeRange", timeRange);
    if (continuation) url.searchParams.set("continuationToken", continuation);

    const res = await fetch(url.toString(), { headers: authHeader(key) });
    if (!res.ok) break;

    const data = await res.json();
    const items: Cart[] = data?.items || data?.data || [];
    out.push(...items);

    continuation = data?.hasMoreResults ? data?.continuationToken ?? null : null;
    guard++;
  } while (continuation && guard < 10); // hard stop; never loop forever

  return out;
}

function hoursSince(iso?: string): number {
  if (!iso) return 0;
  return (Date.now() - new Date(iso).getTime()) / 36e5;
}

function itemsOf(cart: Cart) {
  const raw = Array.isArray(cart.items)
    ? cart.items
    : Array.isArray((cart.items as any)?.items)
    ? (cart.items as any).items
    : [];
  return raw.map((it: any) => ({ name: it.name, qty: it.quantity || 1 }));
}

function firstNameOf(cart: Cart): string | undefined {
  const n =
    (cart as any)?.billingAddressName ||
    (cart as any)?.user?.billingAddress?.firstName ||
    (cart as any)?.billingAddress?.name;
  return typeof n === "string" ? n.split(" ")[0] : undefined;
}

Deno.serve(async (req) => {
  // Allow POST (cron) and GET (manual test from the dashboard).
  if (req.method !== "POST" && req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const key = SNIPCART_API_KEY || SNIPCART_TEST_API_KEY;
  if (!key) return json({ ok: false, error: "no Snipcart secret key set" }, 500);

  const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE!);
  const results = { touch1: 0, touch2: 0, skipped: 0, errors: 0 };

  for (const touch of ["touch1", "touch2"] as const) {
    const minHours = touch === "touch1" ? TOUCH1_MIN_HOURS : TOUCH2_MIN_HOURS;
    const maxHours = touch === "touch1" ? 24 : 168;

    let carts: Cart[] = [];
    try {
      carts = await fetchAbandoned(key, RANGES[touch]);
    } catch {
      results.errors++;
      continue;
    }

    for (const cart of carts) {
      const email = cart?.email;
      const token = cart?.token;
      if (!email || !token) {
        results.skipped++;
        continue;
      }

      // Only carts inside this touch's age window.
      const age = hoursSince(cart.modificationDate || cart.creationDate);
      if (age < minHours || age > maxHours) {
        results.skipped++;
        continue;
      }

      const items = itemsOf(cart);
      if (!items.length) {
        results.skipped++;
        continue;
      }

      // Dedupe: has this cart already had this touch?
      try {
        const { data: seen } = await supabase
          .from("abandoned_cart_emails")
          .select("id")
          .eq("cart_token", token)
          .eq("touch", touch)
          .maybeSingle();
        if (seen) {
          results.skipped++;
          continue;
        }
      } catch {
        // if the check fails, skip rather than risk spamming
        results.skipped++;
        continue;
      }

      // Don't email if this cart was completed in the meantime.
      try {
        const { data: ordered } = await supabase
          .from("orders")
          .select("id")
          .eq("token", token)
          .maybeSingle();
        if (ordered) {
          results.skipped++;
          continue;
        }
      } catch {
        // non-fatal
      }

      const checkoutUrl = "https://asnanik.com/shop/";
      const { subject, html } = abandonedCartEmail(
        firstNameOf(cart),
        checkoutUrl,
        items
      );

      const sent = await sendEmail(email, subject, html);
      if (sent?.ok) {
        await supabase
          .from("abandoned_cart_emails")
          .insert({ cart_token: token, touch, email });
        results[touch]++;
      } else {
        results.errors++;
      }
    }
  }

  return json({ ok: true, ...results });
});

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
