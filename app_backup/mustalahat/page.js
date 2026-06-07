import Link from 'next/link';
import { GLOSSARY } from '../../lib/glossary';
import { SITE } from '../../lib/site';

export const metadata = {
  title: 'مصطلحات طب الأسنان — قاموس مبسّط',
  description:
    'قاموس مبسّط لأهمّ مصطلحات طب الأسنان وصحة الفم، بتعريفات علمية واضحة بالعربية يراجعها أطباء مختصون.',
  alternates: { canonical: '/mustalahat/' },
};

// DefinedTermSet schema — tells AI/Google this is an authoritative glossary of entities.
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
      url: `${SITE.url}/mustalahat/${t.slug}/`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function GlossaryIndex() {
  // group alphabetically isn't meaningful in Arabic ordering here; list as-is
  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <GlossarySchema />
      <nav className="text-sm text-ink/50 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-teal">الرئيسية</Link>
        <span>/</span>
        <span className="text-ink/70">المصطلحات</span>
      </nav>
      <h1 className="text-4xl font-display font-bold text-ink mb-2">مصطلحات طب الأسنان</h1>
      <p className="text-ink/60 mb-10 max-w-2xl">
        قاموس مبسّط لأهمّ المصطلحات في طب الأسنان وصحة الفم، بتعريفات علمية واضحة يراجعها أطباء
        مختصون. اضغط على أي مصطلح لقراءة تعريفه الكامل والمقالات المرتبطة به.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {GLOSSARY.map((t) => (
          <Link
            key={t.slug}
            href={`/mustalahat/${t.slug}/`}
            className="block bg-cream border border-line rounded-xl p-5 shadow-card hover:shadow-soft hover:border-teal-light transition-all group"
          >
            <h2 className="font-display text-lg text-ink group-hover:text-teal mb-1">{t.term}</h2>
            <p className="text-sm text-ink/55 leading-relaxed line-clamp-2">
              {t.definition.split('.')[0]}.
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
