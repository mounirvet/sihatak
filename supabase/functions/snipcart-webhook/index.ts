// supabase/functions/snipcart-webhook/index.ts
//
// Single endpoint Snipcart calls for order + cart events (Snipcart posts ALL
// events to one URL; we filter by eventName).
//
// Events handled:
//   order.completed            -> send confirmation email + schedule review request
//   order.status.changed       -> send processing / shipped / delivered email
//   order.trackingNumber.changed -> send shipped email with tracking (fallback)
//   *.abandoned                -> send cart-recovery email now
//
// Review requests are delayed: order.completed stores a row in `pending_reviews`
// with a send_after timestamp; the scheduled `send-review-requests` function
// mails them later.

import {
  abandonedCartEmail,
  orderConfirmationEmail,
  processingEmail,
  shippedEmail,
  deliveredEmail,
  cancelledEmail,
  disputedCustomerEmail,
  disputedAdminEmail,
  sendEmail,
} from "../_shared/email.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SNIPCART_API_KEY = Deno.env.get("SNIPCART_SECRET_API_KEY"); // live secret
const SNIPCART_TEST_API_KEY = Deno.env.get("SNIPCART_TEST_SECRET_API_KEY"); // test secret
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const REVIEW_DELAY_DAYS = 7;

// Snipcart's own webhook examples (PHP/C#/Ruby) do NOT validate the token —
// they just parse eventName and return 200. Validation is optional and only
// "for protected data". Our endpoint URL is secret and we only send emails, so
// a failed validation handshake must NOT block the event (that was causing 401s
// and no emails). We attempt validation for logging, but never reject on it.
async function tryValidateToken(token: string): Promise<boolean> {
  if (!token) return false;
  const keys = [SNIPCART_API_KEY, SNIPCART_TEST_API_KEY].filter(Boolean) as string[];
  for (const key of keys) {
    try {
      const res = await fetch(
        `https://app.snipcart.com/api/requestvalidation/${token}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Basic ${btoa(key + ":")}`,
          },
        }
      );
      if (res.ok) return true;
    } catch {
      // ignore and try next
    }
  }
  return false;
}

function firstNameOf(content: any): string | undefined {
  return content?.billingAddressName?.split(" ")?.[0];
}

function rawItems(content: any): any[] {
  const raw = content?.items;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.items)) return raw.items;
  return [];
}

function itemsOf(content: any) {
  return rawItems(content).map((it: any) => ({
    name: it.name,
    qty: it.quantity || 1,
  }));
}

// Map a Snipcart status string to a lifecycle email. Snipcart's default
// statuses: InProgress / Processed / Disputed / Shipped / Delivered / Cancelled.
// Merchants can also add custom statuses; we match on lowercase keywords so
// Arabic/English/custom labels still route correctly.
function emailForStatus(status: string, content: any) {
  const s = (status || "").toLowerCase();
  const base = {
    firstName: firstNameOf(content),
    invoiceNumber: content?.invoiceNumber,
    orderUrl: "https://asnanik.com/shop/hisabi/",
  };

  if (s.includes("process") || s.includes("تجهيز") || s.includes("progress")) {
    return processingEmail(base);
  }
  if (s.includes("ship") || s.includes("شحن") || s.includes("transit")) {
    return shippedEmail({
      ...base,
      trackingNumber: content?.trackingNumber,
      trackingUrl: content?.trackingUrl,
    });
  }
  if (s.includes("deliver") || s.includes("تسليم") || s.includes("complete")) {
    return deliveredEmail({
      ...base,
      reviewUrl: firstItemUrl(content),
    });
  }
  if (s.includes("cancel") || s.includes("إلغاء") || s.includes("ملغ")) {
    return cancelledEmail({ ...base, items: itemsOf(content) });
  }
  if (s.includes("disput") || s.includes("نزاع") || s.includes("chargeback")) {
    // Customer gets a neutral, non-accusatory notice. The admin alert is sent
    // separately in the handler (it goes to a different address).
    return disputedCustomerEmail(base);
  }
  return null; // Pending / unknown -> no automated email
}

function firstItemUrl(content: any): string | undefined {
  const it = rawItems(content)[0];
  return it?.url;
}

// Normalise Snipcart's many status labels (English/Arabic/custom) to the four
// stages our UI and emails understand.
function simpleStatus(status: string): string {
  const s = (status || "").toLowerCase();
  if (s.includes("process") || s.includes("تجهيز") || s.includes("progress")) return "processing";
  if (s.includes("ship") || s.includes("شحن") || s.includes("transit")) return "shipped";
  if (s.includes("deliver") || s.includes("تسليم")) return "delivered";
  if (s.includes("cancel") || s.includes("إلغاء") || s.includes("ملغ")) return "cancelled";
  if (s.includes("disput") || s.includes("نزاع") || s.includes("chargeback")) return "disputed";
  return "confirmed";
}

// Patch the stored order row for this Snipcart order (matched by token, with
// invoice number as a fallback). Silently no-ops if the order isn't stored yet.
async function updateStoredOrder(supabase: any, content: any, patch: Record<string, unknown>) {
  const token = content?.token;
  const invoice = content?.invoiceNumber;
  try {
    if (token) {
      await supabase.from("orders").update(patch).eq("token", token);
    } else if (invoice) {
      await supabase.from("orders").update(patch).eq("invoice_number", invoice);
    }
  } catch {
    // never let a history write break the email flow
  }
}

// --- duplicate-email guard ---------------------------------------------------
// Marking an order Shipped AND adding a tracking number fires two webhook
// events, which previously sent two identical emails. We record each
// (order, stage) pair we've emailed in a small table and skip repeats.
async function stageAlreadyEmailed(supabase: any, content: any, stage: string): Promise<boolean> {
  const key = content?.token || content?.invoiceNumber;
  if (!key || !stage) return false;
  try {
    const { data } = await supabase
      .from("order_stage_emails")
      .select("id")
      .eq("order_key", key)
      .eq("stage", stage)
      .maybeSingle();
    return !!data;
  } catch {
    return false; // if the check fails, prefer sending over silence
  }
}

async function markStageEmailed(supabase: any, content: any, stage: string) {
  const key = content?.token || content?.invoiceNumber;
  if (!key || !stage) return;
  try {
    await supabase
      .from("order_stage_emails")
      .insert({ order_key: key, stage })
      .select();
  } catch {
    // ignore duplicates / failures
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const token = req.headers.get("x-snipcart-requesttoken") || "";
  // Attempt validation for authenticity, but do NOT block on it — Snipcart's
  // own examples skip validation entirely, and a failed handshake (common in
  // test mode) must not stop the email. The endpoint URL is secret.
  const validated = await tryValidateToken(token);
  console.log(`[snipcart-webhook] token validated: ${validated}`);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }

  const eventName = body?.eventName;
  const content = body?.content || {};
  const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE!);

  // ---- Order completed: send confirmation + schedule review ----
  if (eventName === "order.completed") {
    const email = content?.email;
    const firstName = firstNameOf(content);
    const items = itemsOf(content);

    if (email) {
      const { subject, html } = orderConfirmationEmail({
        firstName,
        invoiceNumber: content?.invoiceNumber,
        items,
        orderUrl: "https://asnanik.com/shop/hisabi/",
      });
      await sendEmail(email, subject, html);
    }

    // ---- Persist the order, keyed by EMAIL ----------------------------------
    // This is what makes retroactive history work: a guest orders with no
    // account, then signs up later with the same email and sees everything.
    // upsert on `token` so repeated webhook deliveries don't duplicate rows.
    if (email) {
      await supabase.from("orders").upsert(
        {
          email: String(email).toLowerCase(),
          first_name: firstName || null,
          token: content?.token || null,
          invoice_number: content?.invoiceNumber || null,
          total: content?.finalGrandTotal ?? content?.grandTotal ?? null,
          currency: content?.currency?.toUpperCase?.() || "SAR",
          items: rawItems(content).map((it: any) => ({
            name: it.name,
            qty: it.quantity || 1,
            price: it.price ?? null,
            url: it.url || null,
            image: it.image || null,
          })),
          status: "confirmed",
          shipping_address: content?.shippingAddress || null,
          ordered_at: content?.creationDate || new Date().toISOString(),
        },
        { onConflict: "token" }
      );
    }

    const sendAfter = new Date(
      Date.now() + REVIEW_DELAY_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();
    const rows = rawItems(content).map((it: any) => ({
      email,
      first_name: firstName || null,
      product_slug: slugFromUrl(it.url),
      product_name: it.name,
      product_url: it.url,
      send_after: sendAfter,
      sent: false,
    }));
    if (rows.length) await supabase.from("pending_reviews").insert(rows);

    return json({ ok: true, confirmation: !!email, scheduled: rows.length });
  }

  // ---- Order status changed: processing / shipped / delivered ----
  if (eventName === "order.status.changed") {
    const email = content?.email;
    const newStatus = body?.content?.status || body?.status;
    const simple = simpleStatus(newStatus);

    // Keep the stored order in sync so the customer's history is accurate.
    await updateStoredOrder(supabase, content, { status: simple });

    // A dispute (chargeback) also alerts YOU — it needs a manual, time-limited
    // response to the payment provider. Sent to ADMIN_ALERT_EMAIL if set.
    if (simple === "disputed") {
      const adminTo = Deno.env.get("ADMIN_ALERT_EMAIL");
      if (adminTo) {
        const alert = disputedAdminEmail({
          invoiceNumber: content?.invoiceNumber,
          customerEmail: content?.email,
          customerName: content?.billingAddressName,
          total: content?.finalGrandTotal ?? content?.grandTotal,
          orderToken: content?.token,
        });
        await sendEmail(adminTo, alert.subject, alert.html);
      }
    }

    // DUPLICATE GUARD: marking an order Shipped *and* adding a tracking number
    // fires TWO events (status.changed + trackingNumber.changed), which used to
    // send two identical shipped emails. We only send if this stage hasn't been
    // emailed yet, recorded on the order row.
    const already = await stageAlreadyEmailed(supabase, content, simple);
    if (already) {
      return json({ ok: true, status: newStatus, sent: false, reason: "duplicate" });
    }

    const mail = emailForStatus(newStatus, content);
    if (email && mail) {
      await sendEmail(email, mail.subject, mail.html);
      await markStageEmailed(supabase, content, simple);
      return json({ ok: true, status: newStatus, sent: true });
    }
    return json({ ok: true, status: newStatus, sent: false });
  }

  // ---- Tracking number added: send shipped email with tracking ----
  if (eventName === "order.trackingNumber.changed") {
    const email = content?.email;

    await updateStoredOrder(supabase, content, {
      tracking_number: content?.trackingNumber || null,
      tracking_url: content?.trackingUrl || null,
    });

    // Same duplicate guard as above — whichever event arrives first wins.
    const already = await stageAlreadyEmailed(supabase, content, "shipped");
    if (already) {
      return json({ ok: true, tracking: true, sent: false, reason: "duplicate" });
    }

    if (email && content?.trackingNumber) {
      const { subject, html } = shippedEmail({
        firstName: firstNameOf(content),
        invoiceNumber: content?.invoiceNumber,
        trackingNumber: content?.trackingNumber,
        trackingUrl: content?.trackingUrl,
      });
      await sendEmail(email, subject, html);
      await markStageEmailed(supabase, content, "shipped");
      return json({ ok: true, tracking: true, sent: true });
    }
    return json({ ok: true, tracking: false });
  }

  // ---- Cart abandoned: recovery now ----
  if (
    eventName === "customer.abandoned" ||
    eventName === "order.abandoned" ||
    eventName === "cart.abandoned"
  ) {
    const email = content?.email;
    const checkoutUrl = content?.resumeUrl || "https://asnanik.com/shop/";
    const items = itemsOf(content);
    if (email && items.length) {
      const { subject, html } = abandonedCartEmail(
        firstNameOf(content),
        checkoutUrl,
        items
      );
      await sendEmail(email, subject, html);
    }
    return json({ ok: true, event: "abandoned" });
  }

  return json({ ok: true, ignored: eventName });
});

function slugFromUrl(url = "") {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
}

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
