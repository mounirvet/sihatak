import { SITE } from '../lib/site';
import { getReviewer } from '../lib/reviewers';

// This component emits the structured data that makes AI engines and Google
// understand: what the page is, that it's medical, who wrote/reviewed it,
// and the FAQ. This is the single most important technical GEO element.

export default function ArticleSchema({ slug, meta }) {
  const reviewer = getReviewer(meta.reviewer);
  const pageUrl = `${SITE.url}/maqalat/${slug}/`;

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

  const schema = { '@context': 'https://schema.org', '@graph': graph };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
