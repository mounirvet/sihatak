// Related-articles engine.
//
// Goal: build a dense internal-linking graph that spreads ranking authority
// across all articles and signals deep topical expertise to Google + AI engines.
//
// Strategy: for a given article, score every other article by how many
// meaningful keywords they share (in title + excerpt + answer). We then return
// a mix that deliberately includes CROSS-PILLAR matches — because linking
// "daily care" ↔ "gum disease" ↔ "decay" is exactly the topical graph that
// thin, siloed competitor sites lack.

// Arabic stop words to ignore when comparing (common words carry no topic signal).
const STOP_WORDS = new Set([
  'في', 'من', 'على', 'إلى', 'عن', 'مع', 'هل', 'ما', 'هي', 'هو', 'و', 'أو',
  'أن', 'إن', 'كيف', 'متى', 'لماذا', 'التي', 'الذي', 'هذا', 'هذه', 'بعد',
  'قبل', 'كل', 'عند', 'بين', 'هذه', 'تكون', 'يكون', 'لها', 'لك', 'أم',
  'الأسنان', 'الأسنان؟', 'الفم', 'صحة', 'دليل', 'ماذا',
]);

// Normalize Arabic text: strip punctuation/diacritics, unify alef/ya/ta-marbuta,
// so "اللثة" and "لثة" or "الأسنان" and "أسنان" match.
function normalize(text = '') {
  return text
    .replace(/[\u064B-\u0652]/g, '') // diacritics
    .replace(/[.,،:؛!؟"'(){}\[\]\-—…]/g, ' ') // punctuation
    .replace(/[إأآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ـ/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function keywords(article) {
  const text = `${article.meta.title || ''} ${article.meta.excerpt || ''} ${article.meta.answer || ''}`;
  const words = normalize(text).split(' ');
  const set = new Set();
  for (let w of words) {
    // strip a leading definite article "ال" to match al-words with bare words
    if (w.startsWith('ال') && w.length > 4) w = w.slice(2);
    if (w.length >= 3 && !STOP_WORDS.has(w)) set.add(w);
  }
  return set;
}

/**
 * Return the most relevant articles to `current`, blending topical relevance
 * with a deliberate cross-pillar boost.
 *
 * @param {object} current - the article being viewed ({ slug, meta })
 * @param {array} all - all articles
 * @param {number} limit - how many to return
 */
export function getRelatedArticles(current, all, limit = 4) {
  const currentKw = keywords(current);

  const scored = all
    .filter((a) => a.slug !== current.slug)
    .map((a) => {
      const kw = keywords(a);
      let shared = 0;
      for (const w of kw) if (currentKw.has(w)) shared++;

      // Cross-pillar matches get a relevance boost: they build the
      // topical graph and surface genuinely complementary reading.
      const crossPillar = a.meta.pillar !== current.meta.pillar;
      const score = shared + (crossPillar && shared > 0 ? 1.5 : 0);

      return { article: a, score, shared, crossPillar };
    })
    .filter((x) => x.shared > 0)
    .sort((a, b) => b.score - a.score);

  // Ensure variety: aim for at least 1–2 cross-pillar picks if available,
  // so every article links outward beyond its own silo.
  const picked = [];
  const usedSlugs = new Set();

  // first pass: take top-scored, but cap same-pillar to leave room for cross-pillar
  let samePillarCount = 0;
  for (const x of scored) {
    if (picked.length >= limit) break;
    if (usedSlugs.has(x.article.slug)) continue;
    if (!x.crossPillar && samePillarCount >= 2) continue; // reserve slots for cross-pillar
    picked.push(x.article);
    usedSlugs.add(x.article.slug);
    if (!x.crossPillar) samePillarCount++;
  }

  // second pass: fill any remaining slots with next best (regardless of pillar)
  if (picked.length < limit) {
    for (const x of scored) {
      if (picked.length >= limit) break;
      if (usedSlugs.has(x.article.slug)) continue;
      picked.push(x.article);
      usedSlugs.add(x.article.slug);
    }
  }

  return picked;
}
