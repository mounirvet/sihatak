// app/shop/shukran/page.jsx — post-purchase "order received" page (شكرًا).
// noindex: transient post-checkout page, not for search.

import ShukranClient from "../../../components/ShukranClient.jsx";

export const metadata = {
  title: "شكرًا لطلبك | أسنانك",
  description: "استلمنا طلبك ونعمل عليه الآن.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/shop/shukran/" },
};

export default function ShukranPage() {
  return <ShukranClient />;
}
