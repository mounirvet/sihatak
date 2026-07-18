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
    let redirected = false;
    function goToThankYou(order) {
      if (redirected) return;
      redirected = true;
      // eslint-disable-next-line no-console
      console.log("[asnanik] order confirmed → redirecting to /shop/shukran/", order);
      const token =
        order?.token ||
        order?.cart?.token ||
        order?.invoiceNumber ||
        order?.publicOrderId ||
        "";
      const q = token ? `?token=${encodeURIComponent(token)}` : "";
      // Longer delay lets Snipcart finish its own confirm navigation first,
      // then we override it with a full document navigation (clears the hash).
      setTimeout(() => {
        window.location.href = `${window.location.origin}/shop/shukran/${q}`;
      }, 1200);
    }

    function bind() {
      const S = window.Snipcart;
      if (!S?.events) return;

      // Bind BOTH events — whichever fires first triggers the redirect once.
      // `cart.confirmed` is the SDK event; `order.completed` is the classic one.
      S.events.on("cart.confirmed", (order) => {
        // Analytics must never block the redirect: if it throws, swallow it.
        try {
          trackPurchase(order);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn("[asnanik] trackPurchase failed (non-fatal)", e);
        }
        goToThankYou(order);
      });
      S.events.on("order.completed", (order) => {
        goToThankYou(order);
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

    // NOTE: there is deliberately NO auto-close-on-navigate logic here.
    //
    // An earlier version listened for clicks anywhere on the site and called
    // Snipcart.api.theme.cart.close() so that tapping a nav link would exit the
    // checkout overlay. It also stripped Snipcart's hash route (#/cart,
    // #/checkout) after a click.
    //
    // That broke the store: on mobile the cart would open and be closed again
    // within milliseconds — a "flash" of checkout, then back to the page —
    // making purchase impossible. Guarding by element type and adding a grace
    // period did not fix it reliably.
    //
    // A working cart is worth far more than the convenience of exiting checkout
    // via the nav. Customers can close the overlay with Snipcart's own X button.
    // If we revisit this, it must be built on a Snipcart event that fires only
    // AFTER the overlay is fully open — never on a generic document click.

    return () => {
      document.removeEventListener("snipcart.ready", bind);
    };
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
