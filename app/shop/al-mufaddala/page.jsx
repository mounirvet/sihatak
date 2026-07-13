// app/shop/al-mufaddala/page.jsx — the wishlist page ("المفضلة").
//
// The route is statically generated; its CONTENT is client-rendered from
// localStorage. There's no server and no account system, so the saved items
// only exist in the visitor's browser — which is exactly what we want here.
//
// noindex: the page is empty for every crawler (localStorage is per-visitor),
// so letting Google index it would just add a thin, contentless URL to the site.

import WishlistClient from "../../../components/WishlistClient.jsx";

export const metadata = {
  title: "المفضلة | متجر أسنانك",
  description: "المنتجات التي حفظتها للرجوع إليها لاحقًا.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/shop/al-mufaddala/" },
};

export default function WishlistPage() {
  return <WishlistClient />;
}
