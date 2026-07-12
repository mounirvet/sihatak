"use client";
import { useState } from "react";
import { ShopIcon } from "./ShopIcons.js";

// Product image gallery: large main image + thumbnail strip to switch.
// Images that fail to load (file not yet added) are removed automatically,
// so unfilled slots never show a broken-image icon.
//
// IMAGE SEO:
// - `alts` gives each image a UNIQUE descriptive alt (not one repeated title).
// - width/height are set so the browser reserves space -> no layout shift (CLS).
// - The first image loads eagerly with fetchPriority="high" -> faster LCP.
//   Images 2..5 stay lazy so they don't compete for bandwidth.
export default function ProductGallery({ images = [], alt = "", alts = [] }) {
  const initial = Array.isArray(images) ? images.filter(Boolean) : [];
  const [live, setLive] = useState(initial);
  const [active, setActive] = useState(0);

  // resolve the alt for a given src, keeping it stable even after drops
  const altFor = (src) => {
    const idx = initial.indexOf(src);
    return (idx >= 0 && alts[idx]) || alt;
  };

  const drop = (src) =>
    setLive((prev) => {
      const next = prev.filter((s) => s !== src);
      setActive((a) => Math.min(a, Math.max(0, next.length - 1)));
      return next;
    });

  if (live.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-cream text-teal/20 shadow-card">
        <ShopIcon name="tooth" className="h-24 w-24" />
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden rounded-2xl bg-cream shadow-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={live[active]}
          alt={altFor(live[active])}
          width={1200}
          height={1200}
          loading={active === 0 ? "eager" : "lazy"}
          fetchPriority={active === 0 ? "high" : "auto"}
          decoding="async"
          className="h-full w-full object-contain p-4"
          onError={() => drop(live[active])}
        />
      </div>
      {live.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {live.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={`shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === active ? "border-teal" : "border-line hover:border-teal/40"
              }`}
              aria-label={altFor(src)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={altFor(src)}
                width={64}
                height={64}
                loading="lazy"
                decoding="async"
                className="h-16 w-16 object-contain p-1"
                onError={() => drop(src)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
