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
// Snipcart's ONLY valid timeRange values, matching the dashboard filters:
//   LessThan4Hours · LessThan1Day · LessThan1Week · LessThan1Month
// Earlier this used invented values, so the API returned nothing at all
// (found: 0) and no cart was ever emailed. We now pull ONE wide window
// (LessThan1Month) and do the age filtering ourselves in code — simpler, and
// it means a cart can never fall through a gap between two ranges.
const CART_RANGE = "LessThan1Month";

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
// Diagnostic info from the last API call, surfaced in the function's response.
// Previously `if (!res.ok) break;` swallowed every failure — a 401 (wrong key)
// or 403 (key lacks permission) looked identical to "no carts exist":
// found: 0, errors: 0. That made the real problem invisible.
let lastApiStatus: number | null = null;
let lastApiBody: string | null = null;

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
    lastApiStatus = res.status;

    if (!res.ok) {
      // Keep a short snippet of the error body so we can see WHY.
      try {
        lastApiBody = (await res.text()).slice(0, 300);
      } catch {
        lastApiBody = "(could not read body)";
      }
      break;
    }

    const data = await res.json();
    // Record the shape of a successful response so we can tell "API returned
    // an empty list" apart from "API returned data in a shape we don't parse".
    if (guard === 0) {
      lastApiBody = JSON.stringify({
        totalItems: data?.totalItems,
        itemsLength: Array.isArray(data?.items) ? data.items.length : null,
        keys: Object.keys(data || {}).slice(0, 12),
      });
    }

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

// Snipcart returns the customer email in different places depending on how far
// the shopper got before abandoning. Check every documented/observed location
// rather than assuming a top-level `email`.
function emailOf(cart: any): string | undefined {
  const candidates = [
    cart?.email,
    cart?.user?.email,
    cart?.customer?.email,
    cart?.billingAddress?.email,
    cart?.user?.billingAddress?.email,
    cart?.shippingAddress?.email,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.includes("@")) return c.trim();
  }
  return undefined;
}

Deno.serve(async (req) => {
  // Allow POST (cron) and GET (manual test from the dashboard).
  if (req.method !== "POST" && req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const key = SNIPCART_API_KEY || SNIPCART_TEST_API_KEY;
  if (!key) return json({ ok: false, error: "no Snipcart secret key set" }, 500);

  const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE!);
  // Diagnostic counters. `found` = carts returned by Snipcart; the rest explain
  // exactly why a cart wasn't emailed, so a run that sends nothing is no longer
  // a black box.
  const results = {
    found: 0,
    touch1: 0,
    touch2: 0,
    skipped: 0,
    noToken: 0,
    noEmail: 0,
    outOfWindow: 0,
    alreadySent: 0,
    ordered: 0,
    noItems: 0,
    errors: 0,
  };

  for (const touch of ["touch1", "touch2"] as const) {
    const minHours = touch === "touch1" ? TOUCH1_MIN_HOURS : TOUCH2_MIN_HOURS;
    const maxHours = touch === "touch1" ? 24 : 168;

    let carts: Cart[] = [];
    try {
      carts = await fetchAbandoned(key, CART_RANGE);
    } catch {
      results.errors++;
      continue;
    }
    results.found += carts.length;

    for (const cart of carts) {
      // Snipcart's abandoned-carts API does NOT reliably expose the customer
      // email as a top-level `email` field — depending on how far the customer
      // got in checkout it can live under `user`, `billingAddress`, or
      // `customer`. Reading only `cart.email` meant every cart was skipped
      // silently: the function ran hourly, returned 200, and sent nothing.
      const email = emailOf(cart);
      const token = cart?.token;
      if (!token) {
        results.skipped++;
        results.noToken++;
        continue;
      }
      if (!email) {
        results.skipped++;
        results.noEmail++;
        continue;
      }

      // Only carts inside this touch's age window.
      const age = hoursSince(cart.modificationDate || cart.creationDate);
      if (age < minHours || age > maxHours) {
        results.skipped++;
        results.outOfWindow++;
        continue;
      }

      const items = itemsOf(cart);
      if (!items.length) {
        results.skipped++;
        results.noItems++;
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
          results.alreadySent++;
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
          results.ordered++;
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

  return json({
    ok: true,
    ...results,
    // --- diagnostics (safe: no secrets, only shapes and statuses) ---
    apiStatus: lastApiStatus,          // 200 = OK, 401 = bad key, 403 = no permission
    apiBody: lastApiBody,              // error text, or the shape of a success response
    usingKey: SNIPCART_API_KEY
      ? "live-secret"
      : SNIPCART_TEST_API_KEY
      ? "test-secret"
      : "NONE SET",
    keyLength: (SNIPCART_API_KEY || SNIPCART_TEST_API_KEY || "").length,
  });
});

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
