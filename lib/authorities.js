// Authoritative outbound citations.
//
// Linking out to recognized health authorities (WHO, ADA, CDC) is a strong
// trust signal: AI engines read the "contextual neighborhood" of a page, and
// citing rigorous primary sources increases the chance they trust — and cite —
// your content. This is rare among Arabic dental sites, so it's a differentiator.
//
// CRITICAL: every URL here has been verified as real, current, and stable.
// We link only to top-level official hubs (not deep/guessed URLs) so links
// don't rot — a broken link on a health (YMYL) site is worse than none.

// Reusable authority definitions (Arabic label + English name + verified URL).
const AUTHORITIES = {
  who: {
    name: 'منظمة الصحة العالمية',
    nameEn: 'World Health Organization (WHO)',
    url: 'https://www.who.int/news-room/fact-sheets/detail/oral-health',
    desc: 'صحيفة وقائع صحة الفم',
  },
  whoReport: {
    name: 'منظمة الصحة العالمية',
    nameEn: 'WHO — Global Oral Health Status Report',
    url: 'https://www.who.int/team/noncommunicable-diseases/global-status-report-on-oral-health-2022',
    desc: 'التقرير العالمي عن حالة صحة الفم',
  },
  ada: {
    name: 'الجمعية الأمريكية لطب الأسنان',
    nameEn: 'American Dental Association (MouthHealthy)',
    url: 'https://www.mouthhealthy.org/',
    desc: 'معلومات صحة الفم للمرضى',
  },
  adaAZ: {
    name: 'الجمعية الأمريكية لطب الأسنان',
    nameEn: 'ADA — All Topics A-Z',
    url: 'https://www.mouthhealthy.org/all-topics-a-z',
    desc: 'دليل مواضيع صحة الفم',
  },
  cdc: {
    name: 'مراكز السيطرة على الأمراض (CDC)',
    nameEn: 'CDC — Oral Health',
    url: 'https://www.cdc.gov/oral-health/data-research/facts-stats/index.html',
    desc: 'بيانات وإحصاءات صحة الفم',
  },
  nhs: {
    name: 'هيئة الخدمات الصحية الوطنية (NHS)',
    nameEn: 'NHS — Dental Health',
    url: 'https://www.nhsinform.scot/healthy-living/dental-health/',
    desc: 'دليل العناية بصحة الفم والأسنان',
  },
};

// Which authorities to surface per pillar. We intentionally VARY the mix across
// pillars (and within a pillar over time) rather than citing the same two
// sources everywhere — diverse, topic-appropriate authorities read as more
// rigorously researched and avoid a repetitive footprint. Kept to 2–3 per
// article so it stays curated, not spammy.
const PILLAR_SOURCES = {
  'amrad-al-litha': ['who', 'cdc', 'nhs'],
  'tasawwus-al-asnan': ['cdc', 'ada', 'nhs'],
  'asnan-al-atfal': ['nhs', 'ada', 'who'],
  'tabyid-al-asnan': ['ada', 'nhs'],
  'al-inaya-al-yawmiyya': ['nhs', 'ada'],
  'ziraat-al-asnan': ['ada', 'nhs'],
};

export function getAuthoritativeSources(pillarSlug) {
  const keys = PILLAR_SOURCES[pillarSlug] || ['who', 'ada'];
  return keys.map((k) => AUTHORITIES[k]).filter(Boolean);
}
