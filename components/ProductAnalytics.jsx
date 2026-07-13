"use client";
// components/ProductAnalytics.jsx — fires `view_item` when a product page opens.
//
// The product page is a server component, so it can't call analytics directly.
// This renders nothing; it exists purely as a client boundary for the effect.

import { useEffect } from "react";
import { trackViewItem } from "../lib/analytics.js";

export default function ProductAnalytics({ product }) {
  useEffect(() => {
    trackViewItem(product);
    // Fire once per product page, not on every re-render.
  }, [product.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
