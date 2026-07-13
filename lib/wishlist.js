"use client";
// lib/wishlist.js — client-side wishlist ("المفضلة").
//
// Stored in localStorage: no backend, no accounts, no cookies. Works with
// `output: 'export'`.
//
// We keep a full snapshot of each saved product (title/price/image), not just
// the slug. If we stored slugs only, the wishlist page would need the catalog
// to render — which means either shipping the whole catalog to a page that may
// show two items, or a fetch we can't do on a static export. A snapshot is a
// few hundred bytes and the page renders instantly from storage alone.
//
// Trade-off: if a price changes, a saved snapshot goes stale. We accept that and
// re-sync from the live catalog wherever one is available (see reconcile()).

import { useState, useEffect, useCallback } from "react";

const KEY = "asnanik-wishlist";
const EVENT = "asnanik-wishlist-change";

function read() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return []; // private mode / storage disabled / corrupt JSON
  }
}

function write(items) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable — fail silently; the UI still works in-memory
    // for this session.
  }
  // Notify every component in THIS tab. The native `storage` event only fires
  // in OTHER tabs, so without this a heart clicked on a card wouldn't update
  // the header counter.
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useWishlist() {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(read());
    setReady(true); // guards against an SSR/client markup mismatch

    const sync = () => setItems(read());
    window.addEventListener(EVENT, sync); // same tab
    window.addEventListener("storage", sync); // other tabs
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const has = useCallback(
    (slug) => items.some((i) => i.slug === slug),
    [items]
  );

  const toggle = useCallback((product) => {
    const current = read();
    const exists = current.some((i) => i.slug === product.slug);
    const next = exists
      ? current.filter((i) => i.slug !== product.slug)
      : [
          ...current,
          {
            slug: product.slug,
            title_ar: product.title_ar,
            category: product.category,
            price: product.price,
            compare_at_price: product.compare_at_price ?? null,
            image: product.image || product.images?.[0] || null,
            saved_at: Date.now(),
          },
        ];
    write(next);
    setItems(next);
    return !exists; // true if we just ADDED it
  }, []);

  const remove = useCallback((slug) => {
    const next = read().filter((i) => i.slug !== slug);
    write(next);
    setItems(next);
  }, []);

  const clear = useCallback(() => {
    write([]);
    setItems([]);
  }, []);

  return { items, count: items.length, ready, has, toggle, remove, clear };
}
