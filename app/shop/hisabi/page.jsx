// app/shop/hisabi/page.jsx — the account page ("حسابي").
//
// noindex: login/account pages must never enter the search index. They're
// per-person and contentless to a crawler. Same treatment as al-mufaddala.
// This route is also excluded from sitemap.js.

import AccountClient from "../../../components/Auth/AccountClient.jsx";

export const metadata = {
  title: "حسابي | متجر أسنانك",
  description: "سجّل الدخول لحفظ مفضّلتك ومتابعتها من أي جهاز.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/shop/hisabi/" },
};

export default function AccountPage() {
  return <AccountClient />;
}
