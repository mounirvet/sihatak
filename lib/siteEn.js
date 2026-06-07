// English site config — parallel to lib/site.js.
// PILLARS_EN mirrors the Arabic pillars (same slugs) with English copy.

export const SITE_EN = {
  name: 'Asnanik',
  url: 'https://asnanik.com',
  description:
    'Asnanik is an independent, trusted dental and oral health resource offering clear, scientifically accurate information for the Gulf region, reviewed by qualified dentists.',
  tagline: 'Trusted oral health information, reviewed by professionals',
};

export const PILLARS_EN = [
  {
    slug: 'amrad-al-litha',
    title: 'Gum Disease',
    icon: '🦷',
    summary: 'Everything you need to know about gingivitis, periodontitis, and how to prevent and treat gum disease.',
  },
  {
    slug: 'tasawwus-al-asnan',
    title: 'Tooth Decay',
    icon: '🛡️',
    summary: 'The causes and stages of tooth decay, and how to prevent and treat it in children and adults.',
  },
  {
    slug: 'asnan-al-atfal',
    title: 'Children’s Dental Health',
    icon: '👶',
    summary: 'A parent’s guide to caring for children’s teeth from infancy through adolescence.',
  },
  {
    slug: 'tabyid-al-asnan',
    title: 'Whitening & Cosmetic',
    icon: '✨',
    summary: 'Science-based facts about teeth whitening, cosmetic procedures, and how safe they are.',
  },
  {
    slug: 'al-inaya-al-yawmiyya',
    title: 'Daily Oral Care',
    icon: '🪥',
    summary: 'The right way to brush and floss, and how to choose the products that suit you.',
  },
  {
    slug: 'ziraat-al-asnan',
    title: 'Implants & Restoration',
    icon: '⚙️',
    summary: 'Options for replacing missing teeth, from implants to bridges and dentures.',
  },
];

export const NAV_EN = [
  { label: 'Articles', href: '/en/articles/' },
  { label: 'About', href: '/en/about/' },
];

export function getPillarEn(slug) {
  return PILLARS_EN.find((p) => p.slug === slug) || null;
}
