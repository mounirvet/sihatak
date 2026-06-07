import Link from 'next/link';
import { SITE_EN } from '../../../lib/siteEn';

export const metadata = {
  title: 'About Asnanik',
  description: 'Asnanik is an independent dental and oral health resource for the Gulf region, offering science-based information reviewed by qualified dentists.',
  alternates: { canonical: '/en/about/', languages: { en: '/en/about/', ar: '/man-nahnu/' } },
};

export default function EnAboutPage() {
  return (
    <div className="max-w-prose mx-auto px-5 py-14">
      <h1 className="text-4xl font-display font-bold text-ink mb-6">About Asnanik</h1>
      <div className="prose-ar prose-en text-ink/80 leading-relaxed space-y-4">
        <p>
          Asnanik is an independent educational resource for dental and oral health,
          created to give people in the Gulf region clear, trustworthy, science-based
          information — free of advertising and commercial interests.
        </p>
        <p>
          Every article is written in plain language and <strong>reviewed by qualified
          dentists</strong> to make sure it reflects current, evidence-based dental
          guidance. Our content draws on recognized health authorities such as the World
          Health Organization, the American Dental Association, the CDC, and the NHS.
        </p>
        <p>
          This English section covers our most important topics for English-speaking
          residents and expatriates in the Gulf. Our full library is available in Arabic.
        </p>
        <h2 className="text-2xl font-display text-ink mt-8 mb-3">Important note</h2>
        <p>
          The information on Asnanik is for education only and is not a substitute for
          professional dental advice, diagnosis, or treatment. Always consult a qualified
          dentist about your individual situation.
        </p>
        <p className="pt-4">
          <Link href="/man-nahnu/" className="text-teal hover:underline" dir="rtl">
            النسخة العربية من صفحة «من نحن» ←
          </Link>
        </p>
      </div>
    </div>
  );
}
