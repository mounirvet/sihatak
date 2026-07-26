import { SITE } from '../lib/site';
import { getReviewer } from '../lib/reviewers';

// Schema for insight ("الجديد") pages. Mirrors the article schema so insights
// get the same GEO/E-E-A-T treatment: a medical page entity, a verifiable
// reviewer, an FAQPage (feeds AI answers + rich results), and a breadcrumb.
export default function InsightSchema({ slug, meta }) {
  const reviewer = getReviewer(meta.reviewer);
  const pageUrl = `${SITE.url}/jadeed/${slug}/`;

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
      ...(reviewer
        ? {
            reviewedBy: {
              '@type': 'Person',
              name: reviewer.nameEn || reviewer.name,
              alternateName: reviewer.name,
              url: `${SITE.url}${reviewer.url || '/man-nahnu/al-fariq-al-tibbi/'}`,
              jobTitle: reviewer.specialtyEn || reviewer.credentials,
              ...(reviewer.university
                ? { alumniOf: { '@type': 'CollegeOrUniversity', name: reviewer.university } }
                : {}),
              ...(reviewer.degree
                ? {
                    hasCredential: {
                      '@type': 'EducationalOccupationalCredential',
                      credentialCategory: 'degree',
                      name: reviewer.degree,
                    },
                  }
                : {}),
              ...(reviewer.sameAs && reviewer.sameAs.length ? { sameAs: reviewer.sameAs } : {}),
        ...(reviewer.photo ? { image: `https://asnanik.com${reviewer.photo}` } : {}),
        ...(reviewer.clinic ? { worksFor: {
          '@type': 'Dentist',
          name: reviewer.clinic.name,
          telephone: reviewer.clinic.phoneIntl,
          url: reviewer.clinic.mapUrl,
          address: {
            '@type': 'PostalAddress',
            addressLocality: reviewer.clinic.city,
            addressCountry: reviewer.clinic.countryCode,
          },
        } } : {}),
            },
            lastReviewed: meta.updated || meta.date,
          }
        : {}),
      audience: {
        '@type': 'MedicalAudience',
        geographicArea: { '@type': 'AdministrativeArea', name: 'دول الخليج العربي' },
      },
    },
  ];

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

  graph.push({
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: 'الجديد في طب الأسنان', item: `${SITE.url}/jadeed/` },
      { '@type': 'ListItem', position: 3, name: meta.title, item: pageUrl },
    ],
  });

  const schema = { '@context': 'https://schema.org', '@graph': graph };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}
