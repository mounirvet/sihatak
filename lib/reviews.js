"use client";
// lib/reviews.js — product reviews (light verification).
//
// Reads are PUBLIC (everyone sees reviews on the product page). Writes require
// a logged-in account; a review is flagged `verified` when that account has an
// order recorded. In "light" mode we can't hard-check Snipcart from the browser,
// so verification is based on whether the account has ordered before per our own
// record — for now every logged-in review is allowed, and the verified badge is
// awarded when we can confirm a purchase. This keeps the door open to strict
// server-side verification later without changing the table.
//
// One review per user per product (unique constraint). Editing overwrites.

import { useState, useEffect, useCallback } from "react";
import { getSupabase } from "./supabaseClient.js";
import { useAuth } from "../components/Auth/AuthProvider.jsx";

export function useReviews(productSlug) {
  const { user, enabled } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [ready, setReady] = useState(false);
  const [mine, setMine] = useState(null);

  const load = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setReady(true);
      return;
    }
    const { data, error } = await supabase
      .from("reviews")
      .select("id, user_id, rating, body, author_name, verified, created_at")
      .eq("product_slug", productSlug)
      .order("created_at", { ascending: false });
    if (!error && data) {
      setReviews(data);
      if (user) setMine(data.find((r) => r.user_id === user.id) || null);
    }
    setReady(true);
  }, [productSlug, user]);

  useEffect(() => {
    load();
  }, [load]);

  // Insert or update this user's review for this product.
  const submit = useCallback(
    async ({ rating, body, authorName }) => {
      const supabase = getSupabase();
      if (!supabase || !user) return { error: new Error("login required") };
      const row = {
        product_slug: productSlug,
        user_id: user.id,
        rating,
        body: (body || "").trim(),
        author_name: (authorName || "").trim() || null,
      };
      const { data, error } = await supabase
        .from("reviews")
        .upsert(row, { onConflict: "user_id,product_slug" })
        .select()
        .maybeSingle();
      if (!error) await load();
      return { data, error };
    },
    [productSlug, user, load]
  );

  const removeMine = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase || !user) return;
    await supabase
      .from("reviews")
      .delete()
      .eq("user_id", user.id)
      .eq("product_slug", productSlug);
    await load();
  }, [productSlug, user, load]);

  // Aggregate for display + schema.
  const count = reviews.length;
  const average =
    count > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10
      : 0;

  return {
    reviews,
    ready,
    mine,
    submit,
    removeMine,
    count,
    average,
    canReview: Boolean(enabled && user),
    loggedIn: Boolean(user),
  };
}
