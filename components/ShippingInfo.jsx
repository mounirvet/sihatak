// components/ShippingInfo.jsx — global shipping accordion on the product page.
// Replaces the old GCC-specific one-liner. Collapsed by default; expanding
// explains processing + 5–8 day delivery, worldwide. Pure CSS <details>, no JS,
// static-export safe.

import { IcShip, IcChevron, IcLock, IcReturn } from "./ShopIcons.js";

export default function ShippingInfo() {
  return (
    <details className="group mt-5 overflow-hidden rounded-xl border border-mint bg-mint/25 open:bg-mint/35">
      <summary className="flex cursor-pointer list-none items-center gap-2.5 p-4 text-sm font-medium text-teal-dark">
        <IcShip className="h-5 w-5 shrink-0" />
        <span className="flex-1">شحن عالمي — التوصيل خلال 5 إلى 8 أيام</span>
        <IcChevron className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
      </summary>

      <div className="border-t border-mint/70 px-4 pb-4 pt-3 text-sm leading-relaxed text-ink/80">
        <p>
          نشحن إلى معظم دول العالم. بعد إتمام الطلب تمرّ الشحنة بمرحلة تجهيز، ثم
          تُسلَّم عادةً خلال <strong className="text-teal-dark">5 إلى 8 أيام</strong> من
          انتهاء التجهيز.
        </p>

        <ul className="mt-3 space-y-2">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
            <span>
              <strong className="text-ink">التجهيز:</strong> يبدأ فور تأكيد الدفع،
              ويشمل تحضير الطلب وتغليفه.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
            <span>
              <strong className="text-ink">التوصيل:</strong> من 5 إلى 8 أيام بعد
              التجهيز. قد تختلف المدة قليلًا حسب الوجهة وإجراءات الجمارك المحلية.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
            <span>
              <strong className="text-ink">التتبّع:</strong> يصلك رقم تتبّع الشحنة عبر
              البريد الإلكتروني بمجرد شحن الطلب.
            </span>
          </li>
        </ul>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-mint/70 pt-3 text-xs text-ink/60">
          <span className="inline-flex items-center gap-1.5">
            <IcLock className="h-4 w-4 text-teal" /> دفع آمن عبر Stripe
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IcReturn className="h-4 w-4 text-teal" /> استرجاع خلال 14 يوم
          </span>
        </div>
      </div>
    </details>
  );
}
