import '../styles/globals.css';
import { Tajawal, Reem_Kufi } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import Snipcart from '../components/Snipcart.jsx';
import { SITE } from '../lib/site';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-tajawal',
  display: 'swap',
});
const reemKufi = Reem_Kufi({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-reem',
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
  icons: {
    icon: [
      { url: '/icon.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'ar_AE',
    siteName: SITE.name,
    title: `${SITE.name} | مرجع صحة الأسنان والفم الموثوق`,
    description: SITE.description,
  },
};

function SiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE.url}/#organization`,
        name: SITE.name,
        alternateName: SITE.nameEn,
        url: SITE.url,
        description: SITE.description,
        logo: {
          '@type': 'ImageObject',
          '@id': `${SITE.url}/#logo`,
          url: `${SITE.url}/icons/logo-512.png`,
          width: 512,
          height: 512,
          caption: SITE.name,
        },
        image: { '@id': `${SITE.url}/#logo` },
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2689172979896587"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <CookieConsent />
        {/* Cart + checkout, hosted on OUR domain (Stripe still processes the
            payment behind it). This is what allows a real `Purchase` event to
            fire — impossible while checkout lived on buy.stripe.com. */}
        <Snipcart />
        {/* Vercel Analytics is cookieless and stores no personal identifiers, so
            unlike GA4/Meta it does not sit behind the consent gate. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
