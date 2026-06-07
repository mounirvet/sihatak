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
