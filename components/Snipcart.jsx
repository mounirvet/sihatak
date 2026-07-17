"use client";
// components/Snipcart.jsx — loads Snipcart and bridges its events into analytics.
//
// Snipcart provides the cart + checkout UI, hosted on OUR domain. Stripe remains
// the payment processor behind it (connected inside the Snipcart dashboard), so
// money still settles into the same Stripe account.
//
// The reason this exists: with Stripe Payment Links, checkout happened on
// buy.stripe.com and we could never fire a `Purchase` event. Ad platforms could
// only optimise on clicks. Now the order completes here, so `order.completed`
// lets us report a real sale with real revenue to Meta and GA4.
//
// CURRENCY: set in the Snipcart dashboard, must be SAR to match the site.
// SHIPPING: also set in the Snipcart dashboard (flat 15 SAR). It is NOT
// configured here — Stripe's old shipping rate no longer applies.

import Script from "next/script";
import { useEffect } from "react";
import { trackBeginCheckout, trackPurchase } from "../lib/analytics.js";

// Two PUBLIC keys. The site auto-selects based on where it runs, so we never
// risk shipping the test key to production or forgetting to swap back.
//   • asnanik.com            -> LIVE key  (real customers, real payments)
//   • localhost / *.vercel.app -> TEST key (test card 4242..., no charges)
const SNIPCART_LIVE_KEY =
  "NzRhOGFlYjEtZGFlOS00MWZiLWFhZDgtMTM0ZmY1YjNhM2Q4NjM5MTk1NDAwMTA1NzYxMzAz";
const SNIPCART_TEST_KEY =
  "YmNmZGRjYjMtZjkxYS00ZTg4LWIyMmItYzJlZmQ0M2M0NzQ1NjM5MTk1NDAwMTA1NzYxMzAz";

function pickSnipcartKey() {
  if (typeof window === "undefined") return SNIPCART_LIVE_KEY; // SSR/static build default
  const host = window.location.hostname;
  const isProd = host === "asnanik.com" || host === "www.asnanik.com";
  return isProd ? SNIPCART_LIVE_KEY : SNIPCART_TEST_KEY;
}

export default function Snipcart() {
  const SNIPCART_PUBLIC_KEY = pickSnipcartKey();

  useEffect(() => {
    // Static export bakes the build-time key into the HTML. Correct it in the
    // browser BEFORE Snipcart initializes, so localhost/preview truly use the
    // test key. Snipcart reads data-api-key when its script boots.
    const el = document.getElementById("snipcart");
    if (el) el.setAttribute("data-api-key", pickSnipcartKey());

    // Snipcart loads async; `snipcart.ready` fires once its API exists.
    function bind() {
      const S = window.Snipcart;
      if (!S?.events) return;

      S.events.on("cart.confirmed", (order) => {
        // Fires on a COMPLETED, PAID order. This is the event that makes
        // conversion optimisation and ROAS possible.
        trackPurchase(order);

        // Redirect to our branded "order received" page (شكرًا) instead of
        // leaving the customer on Snipcart's default screen. Pass the order
        // token so the page can show a reference number. Small delay lets the
        // purchase event flush first.
        const token =
          order?.token ||
          order?.cart?.token ||
          order?.invoiceNumber ||
          "";
        setTimeout(() => {
          const q = token ? `?token=${encodeURIComponent(token)}` : "";
          window.location.assign(`/shop/shukran/${q}`);
        }, 400);
      });

      S.events.on("theme.routechanged", ({ to }) => {
        if (to === "/checkout") {
          const cart = S.store?.getState?.()?.cart;
          trackBeginCheckout({
            items: cart?.items?.items || [],
            total: cart?.total,
          });
        }
      });
    }

    if (window.Snipcart) bind();
    else document.addEventListener("snipcart.ready", bind, { once: true });

    return () => document.removeEventListener("snipcart.ready", bind);
  }, []);

  return (
    <>
      <link rel="preconnect" href="https://app.snipcart.com" />
      <link rel="preconnect" href="https://cdn.snipcart.com" />
      <link
        rel="stylesheet"
        href="https://cdn.snipcart.com/themes/v3.7.1/default/snipcart.css"
      />
      <Script
        src="https://cdn.snipcart.com/themes/v3.7.1/default/snipcart.js"
        strategy="afterInteractive"
      />
      <div
        hidden
        id="snipcart"
        data-api-key={SNIPCART_PUBLIC_KEY}
        data-config-modal-style="side"
        data-currency="sar"
        data-config-add-product-behavior="none"
      />
    </>
  );
}
