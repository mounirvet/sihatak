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

/** Added to the Snipcart cart. */
export function trackAddToCart(p) {
  if (!p) return;
  gtagEvent("add_to_cart", {
    currency: CURRENCY,
    value: p.price,
    items: [toItem(p)],
  });
  fbqEvent("AddToCart", {
    content_ids: [p.slug],
    content_name: p.title_ar,
    content_type: "product",
    value: p.price,
    currency: CURRENCY,
  });
}

/**
 * Snipcart's SDK nests the line items differently depending on the event:
 * sometimes `items` is a bare array, sometimes it's `{ items: [...] }`, and on
 * the confirmed cart it can be `cart.items.items`. Calling `.map` on the object
 * form throws ("(e.items||[]).map is not a function"), which — because it runs
 * inside the cart.confirmed handler — aborts everything after it, including the
 * thank-you-page redirect. This normalises any of those shapes to a real array.
 */
function itemsArray(source) {
  const raw = source?.items;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.items)) return raw.items;
  if (Array.isArray(source)) return source;
  return [];
}

/** Opened the checkout. Wired to Snipcart's `checkout.opened` hook. */
export function trackBeginCheckout(cart) {
  const items = itemsArray(cart).map((i) => ({
    item_id: i.id,
    item_name: i.name,
    price: i.price,
    currency: CURRENCY,
    quantity: i.quantity,
  }));
  gtagEvent("begin_checkout", {
    currency: CURRENCY,
    value: cart?.total ?? 0,
    items,
  });
  fbqEvent("InitiateCheckout", {
    content_ids: items.map((i) => i.item_id),
    content_type: "product",
    num_items: items.length,
    value: cart?.total ?? 0,
    currency: CURRENCY,
  });
}

/**
 * PURCHASE — the entire reason checkout moved onto asnanik.com.
 *
 * With Stripe Payment Links this event was IMPOSSIBLE: the transaction
 * completed on buy.stripe.com, so no pixel of ours could ever fire and the ad
 * platforms could only optimise on clicks. Now Snipcart completes the order on
 * our own domain and we can report the real sale, with real revenue, back to
 * Meta and GA4. This is what makes conversion-optimised campaigns and ROAS
 * possible at all.
 *
 * Wired to Snipcart's `order.completed` hook.
 */
export function trackPurchase(order) {
  if (!order) return;
  const items = itemsArray(order).map((i) => ({
    item_id: i.id,
    item_name: i.name,
    price: i.price,
    currency: CURRENCY,
    quantity: i.quantity,
  }));

  gtagEvent("purchase", {
    transaction_id: order.token || order.invoiceNumber,
    currency: CURRENCY,
    value: order.finalGrandTotal ?? order.grandTotal ?? 0,
    shipping: order.shippingFees ?? 0,
    items,
  });

  fbqEvent("Purchase", {
    content_ids: items.map((i) => i.item_id),
    content_type: "product",
    num_items: items.length,
    value: order.finalGrandTotal ?? order.grandTotal ?? 0,
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
