import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, getProductSlugs, getToolCategory } from '../../../../lib/tools';
import { SITE } from '../../../../lib/site';
import AffiliateDisclosure from '../../../../components/AffiliateDisclosure';

export function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const p = getProduct(params.slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${p.category.title} | أسنانك`,
    description: (p.description || '').slice(0, 155),
    alternates: { canonical: `/adawat/muntaj/${params.slug}/` },
  };
}

// Product schema — honest. Specs become additionalProperty (real, useful structured data).
// NEVER fake ratings/reviews; no price unless real.
function ProductSchema({ p }) {
  const pageUrl = `${SITE.url}/adawat/muntaj/${p.slug}/`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${pageUrl}#product`,
    name: p.name,
    description: p.description,
    category: p.category.title,
    url: pageUrl,
  };
  const realSpecs = (p.specs || []).filter((s) => s.value && !s.value.includes('PLACEHOLDER'));
  if (realSpecs.length) {
    schema.additionalProperty = realSpecs.map((s) => ({
      '@type': 'PropertyValue',
      name: s.label,
      value: s.value,
    }));
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function ProductPage({ params }) {
  const p = getProduct(params.slug);
  if (!p) notFound();
  const c = p.category;

  const realSpecs = (p.specs || []).filter((s) => s.value && !s.value.includes('PLACEHOLDER'));
  const realBestFor = (p.bestFor || []).filter((t) => !t.includes('PLACEHOLDER'));

  // sibling products in same category (excluding this one), real ones only
  const siblings = (getToolCategory(c.slug)?.products || [])
    .filter((x) => x.slug !== p.slug && !x.name.includes('PLACEHOLDER'))
    .slice(0, 4);

  return (
    <div className="bg-sand">
      <ProductSchema p={p} />
      <div className="max-w-prose mx-auto px-5 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-ink/50 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-teal">الرئيسية</Link>
          <span>/</span>
          <Link href="/adawat/" className="hover:text-teal">الأدوات</Link>
          <span>/</span>
          <Link href={`/adawat/${c.slug}/`} className="hover:text-teal">{c.title}</Link>
          <span>/</span>
          <span className="text-ink/70">{p.name}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-ink leading-tight mb-2">
          {p.name}
        </h1>
        <p className="text-teal-dark text-sm mb-4">
          ضمن: <Link href={`/adawat/${c.slug}/`} className="hover:underline">{c.title}</Link>
        </p>

        {/* bestFor chips up top — quick "is this me?" signal */}
        {realBestFor.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {realBestFor.map((t, i) => (
              <span key={i} className="text-xs text-teal-dark bg-mint rounded-full px-3 py-1">
                مناسب لـ: {t}
              </span>
            ))}
          </div>
        )}

        <AffiliateDisclosure />

        {/* Description */}
        {p.description && (
          <div className="bg-mint/40 border-r-4 border-teal rounded-lg p-5 mb-8">
            <p className="text-ink text-lg leading-relaxed">{p.description}</p>
          </div>
        )}

        {/* Primary CTA — where to buy (only if set) */}
        {p.whereToBuy && (
          <div className="mb-8">
            <a
              href={p.whereToBuy}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="inline-block bg-teal text-cream rounded-full px-7 py-3 text-base hover:bg-teal-dark transition-colors shadow-card"
            >
              أين تشتريه ←
            </a>
            <p className="text-xs text-ink/45 mt-2">رابط شراكة قد ينقلك إلى متجر خارجي.</p>
          </div>
        )}

        {/* Why we recommend it */}
        {p.why && (
          <div className="mb-8">
            <h2 className="text-xl font-display text-ink mb-2">لماذا نوصي به؟</h2>
            <p className="text-ink/80 leading-relaxed">{p.why}</p>
          </div>
        )}

        {/* Specs table */}
        {realSpecs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-display text-ink mb-3">المواصفات</h2>
            <table className="w-full text-sm border-collapse">
              <tbody>
                {realSpecs.map((s, i) => (
                  <tr key={i} className="border-b border-line">
                    <td className="py-2 pl-3 text-ink/60 w-1/2">{s.label}</td>
                    <td className="py-2 text-ink font-medium">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Features */}
        {p.features && p.features.length > 0 && !p.features[0].includes('PLACEHOLDER') && (
          <div className="mb-8">
            <h2 className="text-xl font-display text-ink mb-3">الميزات</h2>
            <ul className="space-y-2 text-ink/80 leading-relaxed">
              {p.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-teal mt-1">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Compare with others in category */}
        {siblings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-display text-ink mb-3">قارن مع خيارات أخرى</h2>
            <div className="flex flex-wrap gap-2">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={`/adawat/muntaj/${s.slug}/`}
                  className="text-sm text-teal border border-teal/30 rounded-full px-4 py-1.5 hover:bg-teal hover:text-cream transition-colors"
                >
                  {s.name}
                </Link>
              ))}
            </div>
            <div className="mt-3">
              <Link href={`/adawat/${c.slug}/`} className="text-sm text-teal hover:underline">
                ← جدول المقارنة الكامل ودليل الاختيار
              </Link>
            </div>
          </div>
        )}

        {/* Medical note */}
        <p className="text-xs text-ink/45 mt-10 pt-6 border-t border-line leading-relaxed">
          هذه الصفحة تثقيفية لمساعدتك على الاختيار، ولا تُغني عن استشارة طبيب الأسنان، خاصة عند
          وجود حساسية أو مشاكل في الأسنان أو اللثة.
        </p>
      </div>
    </div>
  );
}
