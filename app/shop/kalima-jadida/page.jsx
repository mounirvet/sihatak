// app/shop/kalima-jadida/page.jsx — set-new-password page (كلمة مرور جديدة).
// Where the reset-password email link lands. noindex: transient auth page.

import ResetPasswordClient from "../../../components/Auth/ResetPasswordClient.jsx";

export const metadata = {
  title: "تعيين كلمة مرور جديدة | أسنانك",
  description: "اختر كلمة مرور جديدة لحسابك.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/shop/kalima-jadida/" },
};

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}
