// lib/supabaseConfig.js — the ONE place your two Supabase values live.
//
// Both of these are the SAFE, public values (Project URL + anon/public key).
// They are DESIGNED to ship in frontend code. The security that protects your
// data is the Row Level Security policies in the database, not the secrecy of
// these values. Never put the `service_role` / secret key here or anywhere.
//
// Two ways to set these, in priority order:
//   1. Environment variables on Vercel (recommended): set
//      NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the Vercel
//      dashboard. If set, they win and the fallback below is ignored.
//   2. The fallback constants below: fill them in directly, like the Meta Pixel
//      slot. Simplest for a manual deploy — no dashboard settings needed.

const FALLBACK_URL = "https://qivrkfrybsvtateinsrl.supabase.co";
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdnJrZnJ5YnN2dGF0ZWluc3JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwOTc3MDcsImV4cCI6MjA5OTY3MzcwN30.iBU8QSut7L4_mD7BWOa5AXUX-x3cnbefZ2akxo_xRvY";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;

// A single flag the rest of the app checks. If either value is missing, the
// whole account layer quietly disables itself and the site falls back to the
// localStorage-only wishlist — nothing breaks.
export const AUTH_ENABLED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
