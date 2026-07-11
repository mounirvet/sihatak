"use client";
import { useState } from "react";
import { ShopIcon } from "./ShopIcons.js";

// Product image gallery: large main image + thumbnail strip to switch.
// Images that fail to load (file not yet added) are removed automatically,
// so unfilled slots never show a broken-image icon.
export default function ProductGallery({ images = [], alt = "" }) {
  const initial = Array.isArray(images) ? images.filter(Boolean) : [];
  const [live, setLive] = useState(initial);
  const [active, setActive] = useState(0);

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
          alt={alt}
          className="h-full w-full object-cover"
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
              aria-label={`صورة ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-16 w-16 object-cover" onError={() => drop(src)} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

