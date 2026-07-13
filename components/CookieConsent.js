'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// GA4 measurement ID — kept here because this component is now the ONLY place
// that may load Analytics, and only after explicit user consent.
const GA_ID = 'G-B1YP77CM1Z';

// Meta Pixel — leave EMPTY until you create the pixel in Meta Events Manager.
// When you have it (15–16 digits), paste it here and nothing else changes: the
// pixel loads through the same consent gate as GA4, and lib/analytics.js already
// fires ViewContent / InitiateCheckout / AddToWishlist into it.
const META_PIXEL_ID = ''; // e.g. '1234567890123456'

const STORAGE_KEY = 'asnanik-cookie-consent'; // values: 'accepted' | 'declined'

// Inject GA4 exactly once, only after consent. Mirrors the previous setup
// (afterInteractive behaviour) but gated behind the user's choice.
function loadAnalytics() {
  if (typeof window === 'undefined') return;
  if (window.__asnanikGaLoaded) return;
  window.__asnanikGaLoaded = true;

  const s = document.createElement('script');
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  s.async = true;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
}

// Meta Pixel — same consent gate. No-op while META_PIXEL_ID is empty.
function loadMetaPixel() {
  if (typeof window === 'undefined') return;
  if (!META_PIXEL_ID) return; // not configured yet
  if (window.__asnanikFbLoaded) return;
  window.__asnanikFbLoaded = true;

  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq('init', META_PIXEL_ID);
  window.fbq('track', 'PageView');
}

// Everything that requires consent, loaded together.
function loadTrackers() {
  loadAnalytics();
  loadMetaPixel();
}

export default function CookieConsent() {
  // null = not yet decided this session/render; 'accepted' | 'declined' otherwise.
  const [choice, setChoice] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let saved = null;
    try {
      saved = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // localStorage may be unavailable; treat as undecided.
    }
    if (saved === 'accepted') {
      setChoice('accepted');
      loadTrackers();
    } else if (saved === 'declined') {
      setChoice('declined');
    }
    // if nothing saved, choice stays null -> banner shows
  }, []);

  function persist(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore storage failures
    }
  }

  function accept() {
    persist('accepted');
    setChoice('accepted');
    loadTrackers();
  }

  function decline() {
    persist('declined');
    setChoice('declined');
    // Analytics is never loaded.
  }

  // Don't render anything during SSR or until we've checked storage,
  // and hide once a choice exists.
  if (!mounted || choice) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="إشعار ملفّات تعريف الارتباط"
      className="fixed bottom-0 inset-x-0 z-50 print:hidden"
    >
      <div className="max-w-4xl mx-auto m-3 bg-ink text-cream rounded-2xl shadow-soft border border-cream/10 p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <p className="text-sm leading-relaxed text-cream/85 flex-1">
            نستخدم ملفّات تعريف الارتباط لقياس الزيارات وتحسين تجربتك. يمكنك قبولها أو
            رفضها. لمعرفة المزيد، اطّلع على{' '}
            <Link href="/man-nahnu/siyasat-al-khususiyya/" className="text-coral underline">
              سياسة الخصوصية
            </Link>
            .
          </p>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={decline}
              className="px-4 py-2 rounded-full text-sm border border-cream/30 text-cream/85 hover:bg-cream/10 transition-colors"
            >
              رفض
            </button>
            <button
              onClick={accept}
              className="px-5 py-2 rounded-full text-sm bg-coral text-white font-medium hover:opacity-90 transition-opacity"
            >
              قبول
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
