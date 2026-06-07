import { SITE, PILLARS } from '../lib/site';
import { getReviewer } from '../lib/reviewers';

// This component emits the structured data that makes AI engines and Google
// understand: what the page is, that it's medical, who wrote/reviewed it,
// the FAQ, and the breadcrumb hierarchy. This is the core GEO element.

export default function ArticleSchema({ slug, meta }) {
  const reviewer = getReviewer(meta.reviewer);
  const pageUrl = `${SITE.url}/maqalat/${slug}/`;
  const pillar = PILLARS.find((p) => p.slug === meta.pillar);

  const graph = [
    {
      '@type': 'MedicalWebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: meta.title,
      headline: meta.title,
      description: meta.excerpt || meta.answer,
      inLanguage: 'ar',
      datePublished: meta.date,
      dateModified: meta.updated || meta.date,
      isPartOf: { '@id': `${SITE.url}/#website` },
      publisher: { '@id': `${SITE.url}/#organization` },
      // reviewedBy is a strong medical-trust signal
      reviewedBy: {
        '@type': 'Person',
        name: reviewer.name,
        jobTitle: reviewer.credentials,
      },
      lastReviewed: meta.updated || meta.date,
      audience: {
        '@type': 'MedicalAudience',
        geographicArea: { '@type': 'AdministrativeArea', name: 'دول الخليج العربي' },
      },
    },
  ];

  // FAQPage — directly feeds AI answers and Google rich results
  if (Array.isArray(meta.faq) && meta.faq.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: meta.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  // BreadcrumbList — tells Google the page hierarchy (Home → Pillar → Article),
  // and can produce breadcrumb trails in search results instead of a raw URL.
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE.url}/` },
  ];
  if (pillar) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: pillar.title,
      item: `${SITE.url}/mahawir/${pillar.slug}/`,
    });
  }
  breadcrumbItems.push({
    '@type': 'ListItem',
    position: breadcrumbItems.length + 1,
    name: meta.title,
    item: pageUrl,
  });
  graph.push({
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: breadcrumbItems,
  });

  const schema = { '@context': 'https://schema.org', '@graph': graph };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}