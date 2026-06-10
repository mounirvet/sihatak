import Link from 'next/link';
import { GLOSSARY } from '../../lib/glossary';
import { SITE } from '../../lib/site';
import GlossaryBrowser from '../../components/GlossaryBrowser';

export const metadata = {
  title: 'مصطلحات طب الأسنان — قاموس مبسّط',
  description:
    'قاموس مبسّط لأهمّ مصطلحات طب الأسنان وصحة الفم، بتعريفات علمية واضحة بالعربية يراجعها أطباء مختصون.',
  alternates: { canonical: '/mustalahat/' },
};

// DefinedTermSet schema — server-rendered for SEO (tells AI/Google this is an
// authoritative glossary of entities). The interactive browsing is a client component.
function GlossarySchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${SITE.url}/mustalahat/#glossary`,
    name: 'مصطلحات طب الأسنان',
    url: `${SITE.url}/mustalahat/`,
    hasDefinedTerm: GLOSSARY.map((t) => ({
      '@type': 'DefinedTerm',
      '@id': `${SITE.url}/mustalahat/${t.slug}/#term`,
      name: t.term,
      alternateName: Array.from(new Set([t.termEn, ...(t.alternateName || [])].filter(Boolean))),
      url: `${SITE.url}/mustalahat/${t.slug}/`,
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

export default function GlossaryIndex() {
  // Pass only the fields the browser needs (keeps client payload lean).
  const terms = GLOSSARY.map((t) => ({
    slug: t.slug,
    term: t.term,
    termEn: t.termEn || '',
    pillar: t.pillar,
    alternateName: t.alternateName || [],
    blurb: (t.quickAnswer || t.definition.split('.')[0] + '.'),
  }));

  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <GlossarySchema />
      <nav className="text-sm text-ink/50 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-teal">الرئيسية</Link>
        <span>/</span>
        <span className="text-ink/70">المصطلحات</span>
      </nav>
      <h1 className="text-4xl font-display font-bold text-ink mb-2">مصطلحات طب الأسنان</h1>
      <p className="text-ink/60 mb-8 max-w-2xl">
        قاموس مبسّط لأهمّ المصطلحات في طب الأسنان وصحة الفم، بتعريفات علمية واضحة يراجعها أطباء
        مختصون. ابحث عن مصطلح أو تصفّح حسب المحور، واضغط على أي مصطلح لقراءة تعريفه الكامل.
      </p>
      <GlossaryBrowser terms={terms} />
    </div>
  );
}
