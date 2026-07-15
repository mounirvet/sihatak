"use client";
// lib/supabaseClient.js — a single shared Supabase browser client.
//
// Created lazily and memoised so every component shares one instance (one auth
// session, one set of listeners). Returns null if auth isn't configured, so
// callers can degrade gracefully to the localStorage-only path.

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, AUTH_ENABLED } from "./supabaseConfig.js";

let _client = null;

export function getSupabase() {
  if (!AUTH_ENABLED) return null;
  if (_client) return _client;
  if (typeof window === "undefined") return null; // browser-only

  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true, // keep the user logged in across visits
      autoRefreshToken: true, // silently refresh before the token expires
      detectSessionInUrl: true, // needed for the email-confirmation redirect
    },
  });
  return _client;
}
