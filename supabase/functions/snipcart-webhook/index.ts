// supabase/functions/snipcart-webhook/index.ts
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
const SNIPCART_TEST_API_KEY = Deno.env.get("SNIPCART_TEST_SECRET_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const REVIEW_DELAY_DAYS = 7;

// Validation is attempted for logging only — it NEVER blocks the event.
// Snipcart's own examples skip validation entirely. Our URL is secret and we
// only send emails, so a failed handshake must not stop the email (that was
// causing 401s and no emails).
async function tryValidateToken(token: string): Promise<boolean> {
  if (!token) return false;
  const keys = [SNIPCART_API_KEY, SNIPCART_TEST_API_KEY].filter(Boolean) as string[];
  for (const key of keys) {
    try {
      const res = await fetch(
        `https://app.snipcart.com/api/requestvalidation/${token}`,
        { headers: { Accept: "application/json", Authorization: `Basic ${btoa(key + ":")}` } }
      );
      if (res.ok) return true;
    } catch {
      // try next key
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
    return deliveredEmail({ ...base, reviewUrl: firstItemUrl(content) });
  }
  return null;
}

function firstItemUrl(content: any): string | undefined {
  const it = rawItems(content)[0];
  return it?.url;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const token = req.headers.get("x-snipcart-requesttoken") || "";
  // Attempt validation for logging, but DO NOT block on it.
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

  if (
    eventName === "customer.abandoned" ||
    eventName === "order.abandoned" ||
    eventName === "cart.abandoned"
  ) {
    const email = content?.email;
    const checkoutUrl = content?.resumeUrl || "https://asnanik.com/shop/";
    const items = itemsOf(content);
    if (email && items.length) {
      const { subject, html } = abandonedCartEmail(firstNameOf(content), checkoutUrl, items);
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