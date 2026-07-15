// supabase/functions/send-review-requests/index.ts
//
// Scheduled function (run via Supabase cron, e.g. daily). Finds pending_reviews
// rows whose send_after has passed and that haven't been sent, emails each, and
// marks them sent. This is the delayed half of the review-request flow.

import { reviewRequestEmail, sendEmail } from "../_shared/email.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

Deno.serve(async () => {
  const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE!);

  const nowIso = new Date().toISOString();
  const { data: due, error } = await supabase
    .from("pending_reviews")
    .select("*")
    .eq("sent", false)
    .lte("send_after", nowIso)
    .limit(100);

  if (error) {
    return json({ ok: false, error: error.message }, 500);
  }
  if (!due || due.length === 0) {
    return json({ ok: true, sent: 0 });
  }

  let sent = 0;
  for (const row of due) {
    const { subject, html } = reviewRequestEmail(
      row.first_name || undefined,
      row.product_name,
      row.product_url
    );
    const result = await sendEmail(row.email, subject, html);
    if (result.ok) {
      await supabase
        .from("pending_reviews")
        .update({ sent: true, sent_at: new Date().toISOString() })
        .eq("id", row.id);
      sent++;
    }
  }

  return json({ ok: true, sent });
});

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
