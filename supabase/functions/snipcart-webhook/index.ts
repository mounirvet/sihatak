// supabase/functions/snipcart-webhook/index.ts
//
// Single endpoint Snipcart calls for order + cart events. Snipcart validates
// its own webhooks with a token we must verify against Snipcart's API.
//
// Events handled:
//   order.completed          -> record order + schedule a review-request email
//   subscription/cart events -> (abandoned cart) send recovery email now
//
// Review requests aren't sent immediately: we store the order in a Supabase
// table `pending_reviews` with a send_after timestamp, and a scheduled function
// (send-review-requests) mails them once the delay passes. This function only
// records; it does not send the review email itself.
//
// Abandoned-cart emails ARE sent here, because Snipcart fires that event after
// its own delay.

import {
  abandonedCartEmail,
  sendEmail,
} from "../_shared/email.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SNIPCART_API_KEY = Deno.env.get("SNIPCART_SECRET_API_KEY"); // secret
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"); // provided to functions automatically
const REVIEW_DELAY_DAYS = 7;

// Verify the webhook is really from Snipcart by validating the token.
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

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const token = req.headers.get("x-snipcart-requesttoken") || "";
  const valid = await validateToken(token);
  if (!valid) {
    return new Response("Invalid webhook token", { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }

  const eventName = body?.eventName;
  const content = body?.content || {};
  const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE!);

  // ---- Order completed: schedule a review request ----
  if (eventName === "order.completed") {
    const email = content?.email;
    const firstName = content?.billingAddressName?.split(" ")?.[0];
    const items = content?.items || [];
    const sendAfter = new Date(
      Date.now() + REVIEW_DELAY_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();

    // one pending row per purchased product
    const rows = items.map((it: any) => ({
      email,
      first_name: firstName || null,
      product_slug: slugFromUrl(it.url),
      product_name: it.name,
      product_url: it.url,
      send_after: sendAfter,
      sent: false,
    }));

    if (rows.length) {
      await supabase.from("pending_reviews").insert(rows);
    }
    return json({ ok: true, scheduled: rows.length });
  }

  // ---- Cart abandoned: send recovery now ----
  if (
    eventName === "customer.abandoned" ||
    eventName === "order.abandoned" ||
    eventName === "cart.abandoned"
  ) {
    const email = content?.email;
    const firstName = content?.billingAddressName?.split(" ")?.[0];
    const checkoutUrl = content?.resumeUrl || "https://asnanik.com/shop/";
    const items = (content?.items || []).map((it: any) => ({
      name: it.name,
      qty: it.quantity || 1,
    }));
    if (email && items.length) {
      const { subject, html } = abandonedCartEmail(firstName, checkoutUrl, items);
      await sendEmail(email, subject, html);
    }
    return json({ ok: true, event: "abandoned" });
  }

  // Unhandled event — acknowledge so Snipcart doesn't retry.
  return json({ ok: true, ignored: eventName });
});

function slugFromUrl(url = "") {
  // .../shop/<category>/<slug>/ -> <slug>
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
}

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
