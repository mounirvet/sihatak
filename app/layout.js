import '../styles/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SITE } from '../lib/site';

// NOTE: Fonts are loaded via CSS @import in globals.css (works everywhere,
// including restricted build sandboxes). For best performance in production
// you can swap to next/font/google with Tajawal + Reem_Kufi.
  <meta name="msvalidate.01" content="3E99ADC007E7015A2CCB2849B198E4E0" />

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | مرجع صحة الأسنان والفم الموثوق`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  alternates: { canonical: '/' },
  verification: {
    other: { 'msvalidate.01': '3E99ADC007E7015A2CCB2849B198E4E0' },
  },
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
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <SiteSchema />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
