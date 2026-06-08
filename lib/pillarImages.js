// Maps each pillar to its hero/share photo (stored in /public/pillars/).
// Only pillars listed here have a photo; others return null and the UI
// gracefully shows no image until a photo is added.
//
// To add a pillar image later: drop the file in public/pillars/<slug>.jpg
// and add a line below.

const PILLAR_IMAGES = {
  'amrad-al-litha': '/pillars/amrad-al-litha.jpg',
  'tasawwus-al-asnan': '/pillars/tasawwus-al-asnan.jpg',
  'asnan-al-atfal': '/pillars/asnan-al-atfal.jpg',
  'tabyid-al-asnan': '/pillars/tabyid-al-asnan.jpg',
  'al-inaya-al-yawmiyya': '/pillars/al-inaya-al-yawmiyya.jpg',
  'ziraat-al-asnan': '/pillars/ziraat-al-asnan.jpg',
};

export function getPillarImage(pillarSlug) {
  return PILLAR_IMAGES[pillarSlug] || null;
}

export function hasPillarImage(pillarSlug) {
  return Boolean(PILLAR_IMAGES[pillarSlug]);
}

// Resolve the hero image for a single article. Prefers a per-article image
// (frontmatter `image:` field, or a file at /public/articles/<slug>.jpg),
// and falls back to the pillar hero so articles without their own image still
// show something. Per-article images are topic-specific, which is better for
// engagement and image-search relevance than a shared pillar photo.
export function getArticleImage(slug, meta = {}) {
  if (meta.image) return meta.image; // explicit path wins
  return ARTICLE_IMAGES[slug] || PILLAR_IMAGES[meta.pillar] || null;
}

// Slugs that have a dedicated optimized image in /public/articles/<slug>.jpg.
// Listed explicitly so the static export only references files that exist.
const ARTICLE_IMAGES_LIST = [
  'ma-huwa-iltihab-al-litha',
  'limadha-tanzif-lithati',
  'asbab-tawarrum-al-litha',
  'ilaj-amrad-al-litha',
  'inhisar-al-litha',
  'inhisar-al-litha-hal-yaud',
  'juyub-al-litha',
  'al-tanzif-al-amiq-taqlih-kasht',
  'khurraj-al-litha',
  'khurraj-al-asnan-tawari',
  'nasur-al-litha-al-mutakarrir',
  'kayfa-ualij-iltihab-al-litha-fil-manzil',
  'al-farq-bayna-iltihab-al-litha-wa-dawaim-al-sin',
  'raihat-al-fam-wa-amrad-al-litha',
  'hal-amrad-al-litha-mudiya',
  'lithat-al-mudakhin',
  'alaqat-al-tadkhin-bi-amrad-al-litha',
  'lithat-tadakhum-dawai',
  'iltihab-al-litha-athna-al-haml',
  'al-alaqa-bayna-amrad-al-litha-wa-al-sukkari',
  'tasabbugh-al-litha-al-dakina',
];
const ARTICLE_IMAGES = Object.fromEntries(
  ARTICLE_IMAGES_LIST.map((s) => [s, `/articles/${s}.jpg`])
);
