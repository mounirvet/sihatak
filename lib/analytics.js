// lib/analytics.js — event helpers for GA4 and (later) Meta Pixel.
//
// CONSENT: these are all no-ops until the user accepts cookies. CookieConsent.jsx
// is the only thing that loads gtag/fbq; if the user declined, `window.gtag` and
// `window.fbq` simply don't exist and every call here quietly returns. That's
// deliberate — no event should ever fire before consent, and no caller should
// have to remember to check.
//
// STATIC-EXPORT SAFE: pure client-side, no server involvement.

const CURRENCY = "SAR";

function gtagEvent(name, params) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return; // no consent -> no gtag -> no-op
  window.gtag("event", name, params);
}

function fbqEvent(name, params) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return; // pixel not installed / no consent
  window.fbq("track", name, params);
}

// Shape a product into GA4's `items` format once, so every event agrees.
function toItem(p, quantity = 1) {
  return {
    item_id: p.slug,
    item_name: p.title_ar,
    item_category: p.category,
    price: p.price,
    currency: CURRENCY,
    quantity,
  };
}

/** Someone opened a product page. */
export function trackViewItem(p) {
  gtagEvent("view_item", {
    currency: CURRENCY,
    value: p.price,
    items: [toItem(p)],
  });
  fbqEvent("ViewContent", {
    content_ids: [p.slug],
    content_name: p.title_ar,
    content_type: "product",
    value: p.price,
    currency: CURRENCY,
  });
}

/**
 * Someone clicked the buy button.
 *
 * NOTE: with Stripe Payment Links this is the LAST event we can see — checkout
 * happens on buy.stripe.com, a domain we don't own, so no purchase event is
 * ever recorded. Treat this as the bottom of the measurable funnel until
 * checkout moves onto asnanik.com.
 */
export function trackBeginCheckout(p) {
  gtagEvent("begin_checkout", {
    currency: CURRENCY,
    value: p.price,
    items: [toItem(p)],
  });
  fbqEvent("InitiateCheckout", {
    content_ids: [p.slug],
    content_name: p.title_ar,
    content_type: "product",
    value: p.price,
    currency: CURRENCY,
  });
}

/** Saved to wishlist. A real intent signal — useful for retargeting later. */
export function trackAddToWishlist(p) {
  gtagEvent("add_to_wishlist", {
    currency: CURRENCY,
    value: p.price,
    items: [toItem(p)],
  });
  fbqEvent("AddToWishlist", {
    content_ids: [p.slug],
    content_name: p.title_ar,
    content_type: "product",
    value: p.price,
    currency: CURRENCY,
  });
}

/** Used the shop search. Tells you what people want that you may not stock. */
export function trackSearch(term, resultCount) {
  if (!term) return;
  gtagEvent("search", { search_term: term, result_count: resultCount });
  fbqEvent("Search", { search_string: term });
}

/** Viewed a category listing. */
export function trackViewItemList(categorySlug, products = []) {
  gtagEvent("view_item_list", {
    item_list_id: categorySlug,
    item_list_name: categorySlug,
    items: products.slice(0, 10).map((p) => toItem(p)),
  });
}
