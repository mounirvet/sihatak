import '../styles/globals.css';
import Script from 'next/script';
import { Tajawal, Reem_Kufi } from 'next/font/google';
import { SITE } from '../lib/site';

// Google Analytics 4 measurement ID
const GA_ID = 'G-B1YP77CM1Z';

// Fonts loaded via Next.js optimized font loader: self-hosted, preloaded,
// and non-render-blocking. This eliminates the slow CSS @import and improves LCP.
const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
});

const reemKufi = Reem_Kufi({
  subsets: ['arabic'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | مرجع صحة الأسنان والفم الموثوق`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ar_AE',
    siteName: SITE.name,
    title: `${SITE.name} | مرجع صحة الأسنان والفم الموثوق`,
    description: SITE.description,
  },
};

// ===== Site-wide schema: tells AI/Google WHO this entity is (E-E-A-T core) =====
function SiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        knowsLanguage: ['ar', 'en'],
        areaServed: ['AE', 'SA', 'KW', 'QA', 'BH', 'OM'],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        inLanguage: 'ar',
        publisher: { '@id': `${SITE.url}/#organization` },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${reemKufi.variable}`}>
      <head>
        <SiteSchema />
      </head>
      <body>
        {children}

        {/* Google Analytics 4 — loads after page is interactive so it doesn't
            hurt Core Web Vitals / LCP. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
