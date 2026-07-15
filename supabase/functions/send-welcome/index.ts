// supabase/functions/send-welcome/index.ts
//
// Fires when a new user confirms their account. Wired as a Supabase Auth Hook
// (or a database webhook on auth.users insert). Sends the welcome email.
//
// Security: this endpoint verifies a shared secret header so random callers
// can't trigger sends. Set WELCOME_HOOK_SECRET in Function secrets and configure
// the hook to send it.

import { welcomeEmail, sendEmail } from "../_shared/email.ts";

Deno.serve(async (req) => {
  // Only POST.
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Shared-secret guard.
  const expected = Deno.env.get("WELCOME_HOOK_SECRET");
  if (expected) {
    const got = req.headers.get("x-hook-secret");
    if (got !== expected) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }

  // Supabase auth hook shapes vary; support both the hook record and a plain
  // { email, first_name } test body.
  const record = payload?.record || payload?.user || payload;
  const email = record?.email;
  const firstName =
    record?.raw_user_meta_data?.first_name ||
    record?.user_metadata?.first_name ||
    record?.first_name ||
    undefined;

  if (!email) {
    return new Response(JSON.stringify({ ok: false, error: "no email" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { subject, html } = welcomeEmail(firstName);
  const result = await sendEmail(email, subject, html);

  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 502,
    headers: { "Content-Type": "application/json" },
  });
});
