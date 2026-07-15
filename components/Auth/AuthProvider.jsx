"use client";
// components/Auth/AuthProvider.jsx — app-wide auth state.
//
// Wraps the app once (in layout) and exposes the current user + auth actions
// through a context. Every consumer reads the same session, so the header,
// the account page, and the wishlist all agree on who is logged in.
//
// If auth is not configured, this renders as a transparent pass-through:
// `user` is always null and the site behaves exactly as it did before accounts.

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getSupabase } from "../../lib/supabaseClient.js";
import { AUTH_ENABLED } from "../../lib/supabaseConfig.js";

const AuthContext = createContext({
  user: null,
  loading: true,
  enabled: false,
  signUp: async () => ({ error: new Error("auth disabled") }),
  signIn: async () => ({ error: new Error("auth disabled") }),
  signOut: async () => {},
  resetPassword: async () => ({ error: new Error("auth disabled") }),
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get the session already in storage (returning visitor), then subscribe
    // to future changes (login / logout / token refresh / email confirmation).
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email, password) => {
    const supabase = getSupabase();
    if (!supabase) return { error: new Error("auth disabled") };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // After the user clicks the confirmation link, send them back to the
        // account page. window.location keeps this correct on any domain.
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/shop/hisabi/`
            : undefined,
      },
    });
    return { data, error };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const supabase = getSupabase();
    if (!supabase) return { error: new Error("auth disabled") };
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email) => {
    const supabase = getSupabase();
    if (!supabase) return { error: new Error("auth disabled") };
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/shop/hisabi/`
          : undefined,
    });
    return { data, error };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        enabled: AUTH_ENABLED,
        signUp,
        signIn,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
