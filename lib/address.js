"use client";
// lib/address.js — a single saved shipping address per user.
//
// Stored in a Supabase `addresses` table (one row per user, enforced by a
// unique constraint on user_id) with the same Row-Level-Security pattern as
// the wishlist: each person can only read/write their own row.
//
// Reference-only: this address is NOT wired into Snipcart checkout. It's shown
// in the account page so the person has it saved; they still type it at
// checkout. Bridging it into Snipcart's checkout fields is a separate, later
// piece of work.

import { useState, useEffect, useCallback } from "react";
import { getSupabase } from "./supabaseClient.js";
import { useAuth } from "../components/Auth/AuthProvider.jsx";

export const EMPTY_ADDRESS = {
  full_name: "",
  phone: "",
  street: "",
  city: "",
  region: "",
  country: "",
  postal_code: "",
};

const FIELDS = Object.keys(EMPTY_ADDRESS);

// Keep only known columns before writing (guards against stray keys).
function clean(obj) {
  const out = {};
  for (const k of FIELDS) out[k] = (obj[k] ?? "").toString().trim();
  return out;
}

export function useAddress() {
  const { user, enabled } = useAuth();
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [ready, setReady] = useState(false);
  const [exists, setExists] = useState(false);

  const active = Boolean(enabled && user);

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!active) {
        setReady(true);
        return;
      }
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!alive) return;
      if (!error && data) {
        const filled = { ...EMPTY_ADDRESS };
        for (const k of FIELDS) filled[k] = data[k] ?? "";
        setAddress(filled);
        setExists(true);
      }
      setReady(true);
    }
    load();
    return () => {
      alive = false;
    };
  }, [active, user]);

  // Insert or update the single row for this user.
  const save = useCallback(
    async (next) => {
      if (!active) return { error: new Error("auth disabled") };
      const supabase = getSupabase();
      const row = { user_id: user.id, ...clean(next) };
      const { data, error } = await supabase
        .from("addresses")
        .upsert(row, { onConflict: "user_id" })
        .select()
        .maybeSingle();
      if (!error) {
        setAddress(clean(next));
        setExists(true);
      }
      return { data, error };
    },
    [active, user]
  );

  return { address, ready, exists, save };
}
