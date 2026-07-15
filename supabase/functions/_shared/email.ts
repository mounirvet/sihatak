// supabase/functions/_shared/email.ts
//
// Shared email layer for all Edge Functions. Sends via Resend using the
// RESEND_API_KEY stored in Supabase Function secrets (never in code/git).
//
// Three RTL Arabic templates: welcome, review request, abandoned cart.
// Brand palette matches the site (teal #0E5C63, coral #E07856, sand #F7F3EC).

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM = "أسنانك <hello@asnanik.com>";
const SITE_URL = "https://asnanik.com";

const TEAL = "#0E5C63";
const TEAL_DARK = "#093E43";
const CORAL = "#E07856";
const SAND = "#F7F3EC";
const CREAM = "#FBF9F4";
const INK = "#0B2027";

// Low-level send. Returns {ok, id?, error?}.
export async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    return { ok: false, error: "RESEND_API_KEY not set" };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data?.message || "send failed" };
    return { ok: true, id: data?.id };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

// Shared RTL shell so every email looks consistent.
function shell(bodyInner: string) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body dir="rtl" style="margin:0;padding:0;background:${SAND};font-family:'Tajawal',Arial,sans-serif;color:${INK};direction:rtl;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;direction:rtl;">
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:22px;font-weight:700;color:${TEAL_DARK};">أسنانك</span>
    </div>
    <div style="background:${CREAM};border-radius:18px;padding:32px 28px;direction:rtl;text-align:right;">
      ${bodyInner}
    </div>
    <p style="text-align:center;color:#9aa;font-size:12px;margin-top:24px;line-height:1.7;">
      أسنانك — مرجعك لصحة الفم والأسنان<br>
      <a href="${SITE_URL}" style="color:${TEAL};text-decoration:none;">asnanik.com</a>
    </p>
  </div>
</body></html>`;
}

function button(label: string, href: string) {
  return `<a href="${href}" style="display:inline-block;background:${TEAL};color:#fff;text-decoration:none;padding:12px 28px;border-radius:12px;font-weight:600;">${label}</a>`;
}

// ---- Template 1: Welcome ----
export function welcomeEmail(firstName?: string) {
  const hi = firstName ? `مرحبًا ${firstName}،` : "مرحبًا بك،";
  const html = shell(`
    <h1 style="font-size:22px;color:${TEAL_DARK};margin:0 0 16px;">${hi}</h1>
    <p style="font-size:15px;line-height:1.9;margin:0 0 16px;">
      أهلًا بك في أسنانك. حسابك جاهز الآن، ويمكنك حفظ مفضّلتك ومتابعتها من أي جهاز،
      وحفظ عنوان الشحن لتسهيل طلباتك القادمة.
    </p>
    <p style="font-size:15px;line-height:1.9;margin:0 0 24px;">
      محتوانا كلّه مُراجَع طبيًا، وهدفنا أن نكون مرجعك الموثوق لكل ما يخصّ صحة فمك.
    </p>
    <div style="text-align:center;">${button("تصفّح المتجر", `${SITE_URL}/shop/`)}</div>
  `);
  return { subject: "أهلًا بك في أسنانك", html };
}

// ---- Template 2: Review request ----
export function reviewRequestEmail(
  firstName: string | undefined,
  productName: string,
  productUrl: string
) {
  const hi = firstName ? `مرحبًا ${firstName}،` : "مرحبًا،";
  const html = shell(`
    <h1 style="font-size:22px;color:${TEAL_DARK};margin:0 0 16px;">${hi}</h1>
    <p style="font-size:15px;line-height:1.9;margin:0 0 16px;">
      نأمل أن يكون <strong>${productName}</strong> قد نال إعجابك.
    </p>
    <p style="font-size:15px;line-height:1.9;margin:0 0 24px;">
      رأيك يساعد غيرك على الاختيار الصحيح — هل تمنحنا دقيقة لتقييم المنتج؟
    </p>
    <div style="text-align:center;margin-bottom:8px;">
      <span style="font-size:26px;color:${CORAL};letter-spacing:4px;">★★★★★</span>
    </div>
    <div style="text-align:center;">${button("اكتب مراجعتك", productUrl)}</div>
  `);
  return { subject: `كيف كانت تجربتك مع ${productName}؟`, html };
}

// ---- Template 3: Abandoned cart ----
export function abandonedCartEmail(
  firstName: string | undefined,
  checkoutUrl: string,
  items: { name: string; qty: number }[]
) {
  const hi = firstName ? `مرحبًا ${firstName}،` : "مرحبًا،";
  const list = items
    .map(
      (i) =>
        `<li style="margin:6px 0;font-size:14px;color:${INK};">${i.name}${
          i.qty > 1 ? ` × ${i.qty}` : ""
        }</li>`
    )
    .join("");
  const html = shell(`
    <h1 style="font-size:22px;color:${TEAL_DARK};margin:0 0 16px;">${hi}</h1>
    <p style="font-size:15px;line-height:1.9;margin:0 0 16px;">
      لاحظنا أنك تركت بعض المنتجات في سلّتك. إنها بانتظارك:
    </p>
    <ul style="margin:0 0 24px;padding-inline-start:20px;">${list}</ul>
    <div style="text-align:center;">${button("أكمل طلبك", checkoutUrl)}</div>
    <p style="font-size:13px;color:#9aa;text-align:center;margin-top:20px;">
      إن أتممت طلبك بالفعل، تجاهل هذه الرسالة.
    </p>
  `);
  return { subject: "سلّتك بانتظارك في أسنانك", html };
}
