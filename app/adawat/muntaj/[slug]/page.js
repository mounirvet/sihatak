import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, getProductSlugs } from '../../../../lib/tools';
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

// Product schema — honest. Emits price `offers` ONLY when a real price is set,
// never fake ratings/reviews.
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
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default function ProductPage({ params }) {
  const p = getProduct(params.slug);
  if (!p) notFound();
  const c = p.category;

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
        <p className="text-teal-dark text-sm mb-6">
          ضمن: <Link href={`/adawat/${c.slug}/`} className="hover:underline">{c.title}</Link>
        </p>

        <AffiliateDisclosure />

        
        {/* Description */}
        {p.description && (
          <div className="bg-mint/40 border-r-4 border-teal rounded-lg p-5 mb-8">
            <p className="text-ink text-lg leading-relaxed">{p.description}</p>
          </div>
        )}

        {/* Why we recommend it */}
        {p.why && (
          <div className="mb-8">
            <h2 className="text-xl font-display text-ink mb-2">لماذا نوصي به؟</h2>
            <p className="text-ink/80 leading-relaxed">{p.why}</p>
          </div>
        )}

        {/* Features */}
        {p.features && p.features.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-display text-ink mb-3">المواصفات والميزات</h2>
            <ul className="space-y-2 text-ink/80 leading-relaxed list-disc pr-5">
              {p.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Optional external link (only if provided) */}
        {p.whereToBuy && (
          <div className="mb-8">
            <a
              href={p.whereToBuy}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="inline-block bg-teal text-cream rounded-full px-6 py-2.5 text-sm hover:bg-teal-dark transition-colors"
            >
              أين تشتريه
            </a>
          </div>
        )}

        {/* Back to category + how to choose */}
        <div className="mt-10 pt-6 border-t border-line text-sm">
          <Link href={`/adawat/${c.slug}/`} className="text-teal hover:underline">
            ← العودة إلى {c.title} وكيفية الاختيار
          </Link>
        </div>

        {/* Medical note */}
        <p className="text-xs text-ink/45 mt-6 leading-relaxed">
          هذه الصفحة تثقيفية لمساعدتك على الاختيار، ولا تُغني عن استشارة طبيب الأسنان، خاصة عند
          وجود حساسية أو مشاكل في الأسنان أو اللثة.
        </p>
      </div>
    </div>
  );
}
