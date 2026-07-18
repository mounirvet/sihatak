// supabase/functions/_shared/email.ts
//
// Shared email layer for all Edge Functions. Sends via Resend using the
// RESEND_API_KEY stored in Supabase Function secrets (never in code/git).
//
// Arabic-only RTL. Brand palette matches the site.
// Modern touches: preheader text, dark-mode-aware colors, bulletproof
// (VML) buttons for Outlook, and a visual order-stage tracker.
//
// SHIPPING MODEL (single source of truth — keep every email consistent):
//   • Processing: 1–2 days after the order is placed.
//   • Transit:    5–8 days after processing.
//   • Overall estimate shown at order time: 8–14 days from order date.
// No shipping cost is stated in emails; each stage speaks only to its own leg.

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM = "أسنانك <hello@asnanik.com>";
const SITE_URL = "https://asnanik.com";

const TEAL = "#0E5C63";
const TEAL_DARK = "#093E43";
const CORAL = "#E07856";
const SAND = "#F7F3EC";
const CREAM = "#FBF9F4";
const INK = "#0B2027";
const MINT = "#D9EBE9";
const MUTED = "#7c8a8c";

// ---- shipping helpers -------------------------------------------------------
export const SHIP = {
  processMin: 1,
  processMax: 2,
  transitMin: 5,
  transitMax: 8,
  totalMin: 8,
  totalMax: 14,
};

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

const AR_DAYS = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const AR_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];
function fmtAr(d: Date) {
  return `${AR_DAYS[d.getDay()]} ${d.getDate()} ${AR_MONTHS[d.getMonth()]}`;
}

// Estimated delivery window (from order date) as a readable Arabic range.
export function deliveryWindow(from: Date = new Date()) {
  const lo = addDays(from, SHIP.totalMin);
  const hi = addDays(from, SHIP.totalMax);
  return `${fmtAr(lo)} — ${fmtAr(hi)}`;
}

// ---- low-level send ---------------------------------------------------------
export async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) return { ok: false, error: "RESEND_API_KEY not set" };
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

// ---- shared shell -----------------------------------------------------------
// `preheader` is the hidden inbox-preview line (modern deliverability touch).
function shell(bodyInner: string, preheader = "") {
  const pre = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>`
    : "";
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<style>
  @media (prefers-color-scheme: dark) {
    .bg-outer { background:#0d1618 !important; }
    .bg-card  { background:#12211f !important; }
    .t-ink    { color:#eaf2f1 !important; }
    .t-muted  { color:#9fb0b1 !important; }
    .divider  { border-color:#24413d !important; }
  }
</style>
</head>
<body class="bg-outer" style="margin:0;padding:0;background:${SAND};font-family:'Tajawal',Arial,sans-serif;color:${INK};direction:rtl;">
  ${pre}
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;direction:rtl;">
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:24px;font-weight:800;color:${TEAL_DARK};letter-spacing:0.5px;">أسنانك</span>
    </div>
    <div class="bg-card" style="background:${CREAM};border-radius:20px;padding:34px 28px;direction:rtl;text-align:right;">
      ${bodyInner}
    </div>
    <p class="t-muted" style="text-align:center;color:${MUTED};font-size:12px;margin-top:24px;line-height:1.8;">
      أسنانك — مرجعك لصحة الفم والأسنان<br>
      <a href="${SITE_URL}" style="color:${TEAL};text-decoration:none;">asnanik.com</a>
    </p>
  </div>
</body></html>`;
}

// Bulletproof button (renders correctly in Outlook via VML).
function button(label: string, href: string, color = TEAL) {
  return `
  <!--[if mso]>
  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
    href="${href}" style="height:46px;v-text-anchor:middle;width:220px;" arcsize="26%" strokecolor="${color}" fillcolor="${color}">
    <w:anchorlock/><center style="color:#ffffff;font-family:Tajawal,Arial,sans-serif;font-size:15px;font-weight:600;">${label}</center>
  </v:roundrect>
  <![endif]-->
  <!--[if !mso]><!-- -->
  <a href="${href}" style="display:inline-block;background:${color};color:#ffffff;text-decoration:none;padding:13px 30px;border-radius:12px;font-weight:600;font-size:15px;">${label}</a>
  <!--<![endif]-->`;
}

// Visual 4-stage order tracker. `active` = 0..3 (confirmed, processing, shipped, delivered).
function tracker(active: number) {
  const stages = ["تم الطلب", "قيد التجهيز", "تم الشحن", "تم التسليم"];
  const cells = stages
    .map((label, i) => {
      const done = i <= active;
      const dotBg = done ? TEAL : "#d8e2e1";
      const dotInner = done
        ? `<span style="color:#fff;font-size:13px;line-height:26px;">✓</span>`
        : `<span style="color:#9fb0b1;font-size:13px;line-height:26px;">${i + 1}</span>`;
      const txtColor = done ? TEAL_DARK : MUTED;
      return `<td align="center" width="25%" style="vertical-align:top;">
        <div style="width:26px;height:26px;border-radius:50%;background:${dotBg};margin:0 auto 6px;text-align:center;">${dotInner}</div>
        <div style="font-size:11px;color:${txtColor};font-weight:${done ? 700 : 400};">${label}</div>
      </td>`;
    })
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr>${cells}</tr></table>`;
}

// Order-items list.
function itemList(items: { name: string; qty: number }[]) {
  return `<ul style="margin:0 0 20px;padding-inline-start:20px;">${items
    .map(
      (i) =>
        `<li class="t-ink" style="margin:6px 0;font-size:14px;color:${INK};">${i.name}${
          i.qty > 1 ? ` × ${i.qty}` : ""
        }</li>`
    )
    .join("")}</ul>`;
}

function infoBox(inner: string, bg = MINT) {
  return `<div style="background:${bg};border-radius:14px;padding:16px 18px;margin:0 0 20px;font-size:14px;line-height:1.9;color:${TEAL_DARK};">${inner}</div>`;
}

// =============================================================================
//  ORDER LIFECYCLE TEMPLATES
// =============================================================================

// ---- 1. Order confirmation (fires on order.completed) ----
export function orderConfirmationEmail(opts: {
  firstName?: string;
  invoiceNumber?: string;
  items: { name: string; qty: number }[];
  orderUrl?: string;
}) {
  const { firstName, invoiceNumber, items, orderUrl } = opts;
  const hi = firstName ? `مرحبًا ${firstName}،` : "مرحبًا،";
  const win = deliveryWindow(new Date());
  const html = shell(
    `
    <h1 class="t-ink" style="font-size:22px;color:${TEAL_DARK};margin:0 0 8px;">شكرًا لطلبك! ✅</h1>
    <p class="t-muted" style="font-size:14px;color:${MUTED};margin:0 0 20px;">
      ${hi} استلمنا طلبك${invoiceNumber ? ` رقم <strong>${invoiceNumber}</strong>` : ""} ونعمل عليه الآن.
    </p>
    ${tracker(0)}
    <h2 class="t-ink" style="font-size:15px;color:${TEAL_DARK};margin:0 0 8px;">تفاصيل طلبك</h2>
    ${itemList(items)}
    ${infoBox(
      `<strong>الوصول المتوقّع:</strong> ${win}<br>
       يبدأ التجهيز خلال ${SHIP.processMin}–${SHIP.processMax} يوم، ثم التوصيل خلال ${SHIP.transitMin}–${SHIP.transitMax} أيام.
       سنُطلعك على كل خطوة برسالة.`
    )}
    <div style="text-align:center;margin-top:8px;">${button(
      "تتبّع طلبك",
      orderUrl || `${SITE_URL}/shop/hisabi/`
    )}</div>
  `,
    `استلمنا طلبك — الوصول المتوقّع ${win}`
  );
  return { subject: "تأكيد طلبك من أسنانك ✅", html };
}

// ---- 2. Processing started (fires on status -> Processing) ----
export function processingEmail(opts: {
  firstName?: string;
  invoiceNumber?: string;
  orderUrl?: string;
}) {
  const { firstName, invoiceNumber, orderUrl } = opts;
  const hi = firstName ? `مرحبًا ${firstName}،` : "مرحبًا،";
  const html = shell(
    `
    <h1 class="t-ink" style="font-size:22px;color:${TEAL_DARK};margin:0 0 8px;">طلبك قيد التجهيز 📦</h1>
    <p class="t-muted" style="font-size:14px;color:${MUTED};margin:0 0 20px;">
      ${hi} بدأنا بتجهيز طلبك${invoiceNumber ? ` رقم <strong>${invoiceNumber}</strong>` : ""} وتغليفه بعناية.
    </p>
    ${tracker(1)}
    ${infoBox(
      `التجهيز يستغرق عادةً <strong>${SHIP.processMin}–${SHIP.processMax} يوم</strong>.
       بمجرد شحن الطلب سنرسل لك رقم التتبّع مباشرة.`
    )}
    <div style="text-align:center;margin-top:8px;">${button(
      "متابعة الطلب",
      orderUrl || `${SITE_URL}/shop/hisabi/`
    )}</div>
  `,
    "بدأنا بتجهيز طلبك"
  );
  return { subject: "طلبك قيد التجهيز الآن 📦", html };
}

// ---- 3. Shipped + tracking (fires on status -> Shipped / trackingNumber.changed) ----
export function shippedEmail(opts: {
  firstName?: string;
  invoiceNumber?: string;
  trackingNumber?: string;
  trackingUrl?: string;
}) {
  const { firstName, invoiceNumber, trackingNumber, trackingUrl } = opts;
  const hi = firstName ? `مرحبًا ${firstName}،` : "مرحبًا،";
  const trackBlock = trackingNumber
    ? infoBox(
        `<strong>رقم التتبّع:</strong> <span style="letter-spacing:1px;">${trackingNumber}</span>`,
        SAND
      )
    : "";
  const html = shell(
    `
    <h1 class="t-ink" style="font-size:22px;color:${TEAL_DARK};margin:0 0 8px;">طلبك في الطريق إليك! 🚚</h1>
    <p class="t-muted" style="font-size:14px;color:${MUTED};margin:0 0 20px;">
      ${hi} تم شحن طلبك${invoiceNumber ? ` رقم <strong>${invoiceNumber}</strong>` : ""}.
    </p>
    ${tracker(2)}
    ${trackBlock}
    ${infoBox(
      `التوصيل يستغرق عادةً <strong>${SHIP.transitMin}–${SHIP.transitMax} أيام</strong> من تاريخ الشحن.
       قد تختلف المدة قليلًا حسب الوجهة وإجراءات الجمارك المحلية.`
    )}
    ${
      trackingUrl
        ? `<div style="text-align:center;margin-top:8px;">${button("تتبّع الشحنة", trackingUrl, CORAL)}</div>`
        : ""
    }
  `,
    trackingNumber ? `شُحن طلبك — رقم التتبّع ${trackingNumber}` : "شُحن طلبك"
  );
  return { subject: "طلبك في الطريق إليك 🚚", html };
}

// ---- 4. Delivered (fires on status -> Delivered) ----
export function deliveredEmail(opts: {
  firstName?: string;
  invoiceNumber?: string;
  reviewUrl?: string;
}) {
  const { firstName, invoiceNumber, reviewUrl } = opts;
  const hi = firstName ? `مرحبًا ${firstName}،` : "مرحبًا،";
  const html = shell(
    `
    <h1 class="t-ink" style="font-size:22px;color:${TEAL_DARK};margin:0 0 8px;">وصل طلبك! 🎉</h1>
    <p class="t-muted" style="font-size:14px;color:${MUTED};margin:0 0 20px;">
      ${hi} نأمل أن يكون طلبك${invoiceNumber ? ` رقم <strong>${invoiceNumber}</strong>` : ""} قد وصلك بحالة ممتازة.
    </p>
    ${tracker(3)}
    ${infoBox(
      `إن واجهت أي مشكلة في طلبك، تواصل معنا خلال مدّة الاسترجاع وسنساعدك.
       نذكّرك أن أي استفسار صحّي يبقى مرجعه طبيب الأسنان.`
    )}
    ${
      reviewUrl
        ? `<p class="t-ink" style="font-size:14px;color:${INK};margin:0 0 16px;">رأيك يهمّنا ويساعد غيرك على الاختيار الصحيح.</p>
           <div style="text-align:center;">${button("شاركنا تجربتك", reviewUrl, CORAL)}</div>`
        : `<div style="text-align:center;">${button("تصفّح المتجر", `${SITE_URL}/shop/`)}</div>`
    }
  `,
    "وصل طلبك — نتمنّى أن ينال إعجابك"
  );
  return { subject: "وصل طلبك من أسنانك 🎉", html };
}

// ---- 5. Cancelled (fires on status -> Cancelled) ----
export function cancelledEmail(opts: {
  firstName?: string;
  invoiceNumber?: string;
  items?: { name: string; qty: number }[];
}) {
  const { firstName, invoiceNumber, items } = opts;
  const hi = firstName ? `مرحبًا ${firstName}،` : "مرحبًا،";
  const html = shell(
    `
    <h1 class="t-ink" style="font-size:22px;color:${TEAL_DARK};margin:0 0 8px;">تم إلغاء طلبك</h1>
    <p class="t-muted" style="font-size:14px;color:${MUTED};margin:0 0 20px;">
      ${hi} نؤكّد إلغاء طلبك${invoiceNumber ? ` رقم <strong>${invoiceNumber}</strong>` : ""}.
    </p>
    ${items && items.length ? itemList(items) : ""}
    ${infoBox(
      `<strong>بخصوص المبلغ:</strong> إن كان قد تم خصم قيمة الطلب، تُعاد إليك تلقائيًا
       خلال <strong>5–10 أيام عمل</strong> حسب مصرفك وطريقة الدفع.
       لا يتطلّب ذلك أي إجراء منك.`
    )}
    <p class="t-ink" style="font-size:14px;color:${INK};margin:0 0 16px;">
      إن لم يكن الإلغاء بطلب منك، أو لديك أي استفسار، تواصل معنا وسنساعدك.
    </p>
    <div style="text-align:center;">${button("تواصل معنا", `${SITE_URL}/man-nahnu/ittasil-bina/`)}</div>
  `,
    "تم إلغاء طلبك — تفاصيل استرداد المبلغ"
  );
  return { subject: "تم إلغاء طلبك من أسنانك", html };
}

// ---- 6. Disputed — CUSTOMER notice (fires on status -> Disputed) ----
// Deliberately neutral and non-accusatory. A dispute usually means the bank is
// reviewing the charge; the customer may not have initiated it. We state the
// facts, avoid blame or legal claims, and invite contact. Nothing here should
// escalate the situation or prejudice the dispute resolution.
export function disputedCustomerEmail(opts: {
  firstName?: string;
  invoiceNumber?: string;
}) {
  const { firstName, invoiceNumber } = opts;
  const hi = firstName ? `مرحبًا ${firstName}،` : "مرحبًا،";
  const html = shell(
    `
    <h1 class="t-ink" style="font-size:22px;color:${TEAL_DARK};margin:0 0 8px;">بخصوص عملية الدفع لطلبك</h1>
    <p class="t-ink" style="font-size:15px;line-height:1.9;color:${INK};margin:0 0 16px;">
      ${hi} وصلَنا إشعار من مزوّد الدفع بشأن عملية الدفع الخاصة بطلبك${
        invoiceNumber ? ` رقم <strong>${invoiceNumber}</strong>` : ""
      }، وهي حاليًا قيد المراجعة لدى الجهة المصرفية.
    </p>
    ${infoBox(
      `قد يحدث ذلك لأسباب عديدة، وأحيانًا دون أي إجراء منك. نحن هنا للمساعدة —
       إن كان لديك أي استفسار حول طلبك أو عملية الدفع، تواصل معنا مباشرة.`
    )}
    <div style="text-align:center;">${button("تواصل معنا", `${SITE_URL}/man-nahnu/ittasil-bina/`)}</div>
  `,
    "بخصوص عملية الدفع لطلبك"
  );
  return { subject: "بخصوص عملية الدفع لطلبك", html };
}

// ---- 7. Disputed — ADMIN alert ----
export function disputedAdminEmail(opts: {
  invoiceNumber?: string;
  customerEmail?: string;
  customerName?: string;
  total?: number | string;
  orderToken?: string;
}) {
  const { invoiceNumber, customerEmail, customerName, total, orderToken } = opts;
  const html = shell(
    `
    <h1 class="t-ink" style="font-size:22px;color:${CORAL};margin:0 0 8px;">⚠️ نزاع على عملية دفع</h1>
    <p class="t-muted" style="font-size:14px;color:${MUTED};margin:0 0 20px;">
      تم تحويل حالة طلب إلى <strong>Disputed</strong>. يتطلّب ذلك مراجعة يدوية عاجلة.
    </p>
    ${infoBox(
      `<strong>رقم الطلب:</strong> ${invoiceNumber || "—"}<br>
       <strong>العميل:</strong> ${customerName || "—"}<br>
       <strong>البريد:</strong> ${customerEmail || "—"}<br>
       <strong>الإجمالي:</strong> ${total ?? "—"}<br>
       ${orderToken ? `<strong>المعرّف:</strong> ${orderToken}` : ""}`,
      SAND
    )}
    <p class="t-ink" style="font-size:14px;color:${INK};margin:0 0 16px;">
      راجع الطلب في لوحة Snipcart وردّ على النزاع لدى مزوّد الدفع ضمن المهلة المحدّدة
      (عادةً 7–14 يومًا). أرفق إثبات الشحن ورقم التتبّع إن توفّرا.
    </p>
    <div style="text-align:center;">${button("فتح لوحة Snipcart", "https://app.snipcart.com/dashboard/orders", CORAL)}</div>
  `,
    `نزاع دفع — طلب ${invoiceNumber || ""}`
  );
  return { subject: `⚠️ نزاع على عملية دفع — طلب ${invoiceNumber || ""}`, html };
}

// =============================================================================
//  REFRESHED EXISTING TEMPLATES
// =============================================================================

// ---- Welcome (refreshed) ----
export function welcomeEmail(firstName?: string) {
  const hi = firstName ? `مرحبًا ${firstName}،` : "مرحبًا بك،";
  const html = shell(
    `
    <h1 class="t-ink" style="font-size:22px;color:${TEAL_DARK};margin:0 0 16px;">${hi} 👋</h1>
    <p class="t-ink" style="font-size:15px;line-height:1.9;margin:0 0 16px;color:${INK};">
      أهلًا بك في أسنانك. حسابك جاهز الآن — يمكنك حفظ مفضّلتك ومتابعتها من أي جهاز،
      وحفظ عنوان الشحن لتسهيل طلباتك القادمة.
    </p>
    <p class="t-ink" style="font-size:15px;line-height:1.9;margin:0 0 24px;color:${INK};">
      محتوانا كلّه مُراجَع طبيًا، وهدفنا أن نكون مرجعك الموثوق لكل ما يخصّ صحة فمك.
    </p>
    <div style="text-align:center;">${button("تصفّح المتجر", `${SITE_URL}/shop/`)}</div>
  `,
    "حسابك في أسنانك جاهز الآن"
  );
  return { subject: "أهلًا بك في أسنانك 👋", html };
}

// ---- Review request (refreshed — no pre-filled star rating) ----
// The previous version rendered ★★★★★ before the customer judged; that nudges
// a 5-star outcome and conflicts with YMYL integrity. Removed — CTA only.
export function reviewRequestEmail(
  firstName: string | undefined,
  productName: string,
  productUrl: string
) {
  const hi = firstName ? `مرحبًا ${firstName}،` : "مرحبًا،";
  const html = shell(
    `
    <h1 class="t-ink" style="font-size:22px;color:${TEAL_DARK};margin:0 0 16px;">${hi}</h1>
    <p class="t-ink" style="font-size:15px;line-height:1.9;margin:0 0 16px;color:${INK};">
      نأمل أن يكون <strong>${productName}</strong> قد نال إعجابك.
    </p>
    <p class="t-ink" style="font-size:15px;line-height:1.9;margin:0 0 24px;color:${INK};">
      رأيك الصادق يساعد غيرك على الاختيار الصحيح — هل تمنحنا دقيقة لتقييم المنتج كما تراه؟
    </p>
    <div style="text-align:center;">${button("اكتب مراجعتك", productUrl, CORAL)}</div>
  `,
    `كيف كانت تجربتك مع ${productName}؟`
  );
  return { subject: `كيف كانت تجربتك مع ${productName}؟`, html };
}

// ---- Abandoned cart (refreshed) ----
export function abandonedCartEmail(
  firstName: string | undefined,
  checkoutUrl: string,
  items: { name: string; qty: number }[]
) {
  const hi = firstName ? `مرحبًا ${firstName}،` : "مرحبًا،";
  const html = shell(
    `
    <h1 class="t-ink" style="font-size:22px;color:${TEAL_DARK};margin:0 0 16px;">${hi}</h1>
    <p class="t-ink" style="font-size:15px;line-height:1.9;margin:0 0 16px;color:${INK};">
      لاحظنا أنك تركت بعض المنتجات في سلّتك. إنها بانتظارك:
    </p>
    ${itemList(items)}
    <div style="text-align:center;">${button("أكمل طلبك", checkoutUrl)}</div>
    <p class="t-muted" style="font-size:13px;color:${MUTED};text-align:center;margin-top:20px;">
      إن أتممت طلبك بالفعل، تجاهل هذه الرسالة.
    </p>
  `,
    "سلّتك بانتظارك في أسنانك"
  );
  return { subject: "سلّتك بانتظارك في أسنانك", html };
}
