"use client";
// components/Auth/AccountLink.jsx — header entry to the account page.
//
// Always links to /shop/hisabi/. The icon gains a small teal dot when someone
// is logged in, so the state is glanceable without extra text. Renders a plain
// (logged-out) icon during load to avoid any flof/hydration flash.

import Link from "next/link";
import { useAuth } from "./AuthProvider.jsx";

export default function AccountLink({ className = "" }) {
  const { user, enabled } = useAuth();
  if (!enabled) return null; // auth off -> no icon at all

  const signedIn = Boolean(user);

  return (
    <Link
      href="/shop/hisabi/"
      aria-label={signedIn ? "حسابي" : "تسجيل الدخول"}
      title={signedIn ? "حسابي" : "تسجيل الدخول"}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition hover:bg-mint/40 hover:text-teal ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
      </svg>
      {signedIn && (
        <span className="absolute -end-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-teal ring-2 ring-cream" />
      )}
    </Link>
  );
}
