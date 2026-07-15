// app/shop/tam-altakid/page.jsx — "email verified" success page (تم التأكيد).
// noindex: transient post-confirmation page, not for search.

import VerifiedClient from "../../../components/Auth/VerifiedClient.jsx";

export const metadata = {
  title: "تم تأكيد البريد | أسنانك",
  description: "تم تأكيد بريدك الإلكتروني بنجاح.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/shop/tam-altakid/" },
};

export default function VerifiedPage() {
  return <VerifiedClient />;
}
