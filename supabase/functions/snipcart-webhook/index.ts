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
  sendEmail,
} from "../_shared/email.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SNIPCART_API_KEY = Deno.env.get("SNIPCART_SECRET_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const REVIEW_DELAY_DAYS = 7;

async function validateToken(token: string): Promise<boolean> {
  if (!token || !SNIPCART_API_KEY) return false;
  try {
    const res = await fetch(
      `https://app.snipcart.com/api/requestvalidation/${token}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${btoa(SNIPCART_API_KEY + ":")}`,
        },
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

function firstNameOf(content: any): string | undefined {
  return content?.billingAddressName?.split(" ")?.[0];
}

function itemsOf(content: any) {
  return (content?.items || []).map((it: any) => ({
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
  return null; // Cancelled / Disputed / unknown -> no automated email
}

function firstItemUrl(content: any): string | undefined {
  const it = (content?.items || [])[0];
  return it?.url;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const token = req.headers.get("x-snipcart-requesttoken") || "";
  const valid = await validateToken(token);
  if (!valid) return new Response("Invalid webhook token", { status: 401 });

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

    const sendAfter = new Date(
      Date.now() + REVIEW_DELAY_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();
    const rows = (content?.items || []).map((it: any) => ({
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
    const mail = emailForStatus(newStatus, content);
    if (email && mail) {
      await sendEmail(email, mail.subject, mail.html);
      return json({ ok: true, status: newStatus, sent: true });
    }
    return json({ ok: true, status: newStatus, sent: false });
  }

  // ---- Tracking number added: send shipped email with tracking ----
  if (eventName === "order.trackingNumber.changed") {
    const email = content?.email;
    if (email && content?.trackingNumber) {
      const { subject, html } = shippedEmail({
        firstName: firstNameOf(content),
        invoiceNumber: content?.invoiceNumber,
        trackingNumber: content?.trackingNumber,
        trackingUrl: content?.trackingUrl,
      });
      await sendEmail(email, subject, html);
      return json({ ok: true, tracking: true });
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
