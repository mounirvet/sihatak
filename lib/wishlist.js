"use client";
// lib/wishlist.js — the wishlist ("المفضلة").
//
// TWO backends behind ONE unchanged API:
//   • Logged OUT  -> localStorage (per-device, no account). Original behaviour.
//   • Logged IN   -> Supabase table `wishlist`, so the list follows the person
//                    across devices.
//
// Every consumer keeps calling the same { items, count, ready, has, toggle,
// remove, clear } — none of them know or care which backend is live.
//
// SNAPSHOT NOTE: localStorage stores a full product snapshot (title/price/image)
// so the wishlist page renders with no catalog lookup. Supabase, by design of
// the SQL table, stores only the product_slug per row. To keep the page
// instant either way, we ALSO keep the snapshot in localStorage as a local
// "catalog cache" and hydrate Supabase slugs against it. Anything not in the
// cache still shows via a minimal slug-only fallback the page handles.
//
// MERGE-ON-LOGIN: the first time a person logs in, whatever they saved on this
// device (localStorage) is pushed up into their account, then the two are
// unioned. Chosen by the site owner over "start fresh".

import { useState, useEffect, useCallback, useRef } from "react";
import { getSupabase } from "./supabaseClient.js";
import { useAuth } from "../components/Auth/AuthProvider.jsx";

const KEY = "asnanik-wishlist";
const EVENT = "asnanik-wishlist-change";

// ---------- localStorage layer (unchanged behaviour) ----------

function readLocal() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(items) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // storage full/unavailable — session still works in-memory
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

// Build a snapshot object from a product (same shape as before).
function snapshot(product) {
  return {
    slug: product.slug,
    title_ar: product.title_ar,
    category: product.category,
    price: product.price,
    compare_at_price: product.compare_at_price ?? null,
    image: product.image || product.images?.[0] || null,
    saved_at: Date.now(),
  };
}

// ---------- Supabase layer ----------

async function sbList(supabase, userId) {
  const { data, error } = await supabase
    .from("wishlist")
    .select("product_slug, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return null;
  return data.map((r) => r.product_slug);
}

async function sbAdd(supabase, userId, slug) {
  // upsert so a repeat add is a no-op, never a duplicate-key error
  await supabase
    .from("wishlist")
    .upsert(
      { user_id: userId, product_slug: slug },
      { onConflict: "user_id,product_slug", ignoreDuplicates: true }
    );
}

async function sbRemove(supabase, userId, slug) {
  await supabase
    .from("wishlist")
    .delete()
    .eq("user_id", userId)
    .eq("product_slug", slug);
}

// Merge every locally-saved slug into the account, once.
async function sbMergeLocal(supabase, userId) {
  const local = readLocal();
  if (!local.length) return;
  const rows = local.map((i) => ({ user_id: userId, product_slug: i.slug }));
  await supabase
    .from("wishlist")
    .upsert(rows, {
      onConflict: "user_id,product_slug",
      ignoreDuplicates: true,
    });
}

// Turn a list of slugs into display items, using the localStorage snapshots as
// a cache. Slugs with no cached snapshot become a minimal item the page can
// still render (and can re-hydrate from the live catalog where available).
function hydrate(slugs) {
  const cache = readLocal();
  const bySlug = new Map(cache.map((i) => [i.slug, i]));
  return slugs.map(
    (slug) =>
      bySlug.get(slug) || {
        slug,
        title_ar: null,
        category: null,
        price: null,
        compare_at_price: null,
        image: null,
        saved_at: null,
        _slugOnly: true, // page shows a link + "view product" for these
      }
  );
}

// ---------- the hook ----------

export function useWishlist() {
  const { user, enabled, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const mergedFor = useRef(null); // guards one-time merge per user

  const usingCloud = Boolean(enabled && user);

  // Load + subscribe.
  useEffect(() => {
    let alive = true;

    async function load() {
      if (authLoading) return; // wait until we know who (if anyone) is logged in

      if (usingCloud) {
        const supabase = getSupabase();
        // one-time merge of this device's local list into the account
        if (mergedFor.current !== user.id) {
          await sbMergeLocal(supabase, user.id);
          mergedFor.current = user.id;
        }
        const slugs = await sbList(supabase, user.id);
        if (!alive) return;
        setItems(slugs ? hydrate(slugs) : readLocal());
        setReady(true);
      } else {
        setItems(readLocal());
        setReady(true);
      }
    }

    load();

    // local changes (same tab + other tabs) still refresh the view
    const sync = () => {
      if (!usingCloud) setItems(readLocal());
    };
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      alive = false;
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [usingCloud, user, authLoading]);

  const has = useCallback((slug) => items.some((i) => i.slug === slug), [items]);

  const toggle = useCallback(
    (product) => {
      const exists = items.some((i) => i.slug === product.slug);

      if (usingCloud) {
        const supabase = getSupabase();
        // optimistic UI: update now, reconcile with the server in the bg
        const next = exists
          ? items.filter((i) => i.slug !== product.slug)
          : [snapshot(product), ...items];
        setItems(next);
        // keep the local snapshot cache warm so other devices can hydrate
        const cache = readLocal().filter((i) => i.slug !== product.slug);
        if (!exists) cache.unshift(snapshot(product));
        writeLocal(cache);

        if (exists) sbRemove(supabase, user.id, product.slug);
        else sbAdd(supabase, user.id, product.slug);
        return !exists;
      }

      // logged out: original localStorage path
      const current = readLocal();
      const next = exists
        ? current.filter((i) => i.slug !== product.slug)
        : [...current, snapshot(product)];
      writeLocal(next);
      setItems(next);
      return !exists;
    },
    [items, usingCloud, user]
  );

  const remove = useCallback(
    (slug) => {
      if (usingCloud) {
        const supabase = getSupabase();
        setItems((prev) => prev.filter((i) => i.slug !== slug));
        writeLocal(readLocal().filter((i) => i.slug !== slug));
        sbRemove(supabase, user.id, slug);
        return;
      }
      const next = readLocal().filter((i) => i.slug !== slug);
      writeLocal(next);
      setItems(next);
    },
    [usingCloud, user]
  );

  const clear = useCallback(() => {
    if (usingCloud) {
      const supabase = getSupabase();
      const slugs = items.map((i) => i.slug);
      setItems([]);
      writeLocal([]);
      slugs.forEach((s) => sbRemove(supabase, user.id, s));
      return;
    }
    writeLocal([]);
    setItems([]);
  }, [items, usingCloud, user]);

  return { items, count: items.length, ready, has, toggle, remove, clear };
}
