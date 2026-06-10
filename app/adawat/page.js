import Link from 'next/link';
import { TOOL_CATEGORIES } from '../../lib/tools';
import { SITE, PILLARS } from '../../lib/site';
import AffiliateDisclosure from '../../components/AffiliateDisclosure';

export const metadata = {
  title: 'أدوات العناية بالأسنان الموصى بها — أسنانك',
  description:
    'دليل مبسّط لاختيار أدوات العناية بالأسنان: فرشاة كهربائية، خيط مائي، مستحضرات تبييض، وأدوات الأطفال — بمعايير اختيار صحية واضحة.',
  alternates: { canonical: '/adawat/' },
};

function ToolsIndexSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'أدوات العناية بالأسنان الموصى بها',
    url: `${SITE.url}/adawat/`,
    inLanguage: 'ar',
    isPartOf: { '@id': `${SITE.url}/#website` },
    about: 'اختيار أدوات ومنتجات العناية بصحة الأسنان والفم',
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default function ToolsIndex() {
  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <ToolsIndexSchema />
      <nav className="text-sm text-ink/50 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-teal">الرئيسية</Link>
        <span>/</span>
        <span className="text-ink/70">الأدوات</span>
      </nav>

      <h1 className="text-4xl font-display font-bold text-ink mb-2">أدوات العناية بالأسنان</h1>
      <p className="text-ink/60 mb-8 max-w-2xl leading-relaxed">
        اختيار الأداة المناسبة جزء من العناية بأسنانك. في هذا القسم نوضّح <strong>كيف تختار</strong>
        أدوات العناية بمعايير صحية واضحة، مع توصيات لمنتجات نراها مناسبة. الأهمّ يبقى التقنية الصحيحة
        والانتظام، واستشارة طبيب الأسنان لحالتك.
      </p>

      <AffiliateDisclosure />

      <div className="grid gap-4 sm:grid-cols-2">
        {TOOL_CATEGORIES.map((c) => {
          const pillar = PILLARS.find((p) => p.slug === c.pillar);
          return (
            <Link
              key={c.slug}
              href={`/adawat/${c.slug}/`}
              className="block bg-cream border border-line rounded-xl p-5 shadow-card hover:shadow-soft hover:border-teal-light transition-all group"
            >
              <h2 className="font-display text-lg text-ink group-hover:text-teal mb-1">{c.title}</h2>
              <p className="text-sm text-ink/55 leading-relaxed line-clamp-2">{c.intro}</p>
              {pillar && (
                <span className="inline-block mt-3 text-xs text-teal-dark bg-mint rounded-full px-3 py-0.5">
                  {pillar.title}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-10 text-sm text-ink/60">
        <p>
          ملاحظة: محتوى هذا القسم تثقيفي لمساعدتك على الاختيار، ولا يُغني عن استشارة طبيب الأسنان،
          خاصة عند وجود حساسية أو مشاكل في الأسنان أو اللثة.
        </p>
      </div>
    </div>
  );
}
