// Automatic in-content internal linking.
//
// Scans an article's body HTML for key dental terms and turns the FIRST
// occurrence of each into a contextual link to that topic's main article.
// In-body contextual links carry strong SEO weight, and the anchor text
// tells search engines + AI exactly what the target page is about.
//
// Safety rules:
//  - never link an article to itself
//  - link each term at most ONCE per article (no spammy over-linking)
//  - never inject links inside headings (<h1>..<h4>) or inside existing <a> tags
//  - longest terms matched first (so "خيط الأسنان" wins over "الأسنان")

// term -> target article slug. Order doesn't matter; we sort by length at runtime.
// Keep targets to the strongest "cornerstone" article for each concept.
const LINK_MAP = [
  // gum disease
  { term: 'التهاب دواعم السن', slug: 'al-farq-bayna-iltihab-al-litha-wa-dawaim-al-sin' },
  { term: 'التهاب اللثة', slug: 'ma-huwa-iltihab-al-litha' },
  { term: 'أمراض اللثة', slug: 'ma-huwa-iltihab-al-litha' },
  { term: 'انحسار اللثة', slug: 'inhisar-al-litha' },
  { term: 'نزيف اللثة', slug: 'limadha-tanzif-lithati' },
  { term: 'رائحة الفم', slug: 'raihat-al-fam-wa-amrad-al-litha' },

  // decay
  { term: 'تسوّس الأسنان', slug: 'ma-huwa-tasawwus-al-asnan' },
  { term: 'التسوّس', slug: 'ma-huwa-tasawwus-al-asnan' },
  { term: 'الفلورايد', slug: 'dawr-al-fluraid-fil-wiqaya' },
  { term: 'حشو الأسنان', slug: 'hashw-al-asnan-al-marahil-wal-anwa' },
  { term: 'حشو', slug: 'hashw-al-asnan-al-marahil-wal-anwa' },

  // daily care
  { term: 'خيط الأسنان', slug: 'kayfa-astakhdim-khayt-al-asnan' },
  { term: 'غسول الفم', slug: 'ghasul-al-fam-hal-ahtajuh' },
  { term: 'معجون الأسنان', slug: 'kayfa-akhtar-majun-al-asnan' },
  { term: 'فرشاة الأسنان', slug: 'kayfa-akhtar-furshat-al-asnan' },

  // whitening / cosmetic
  { term: 'تبييض الأسنان', slug: 'tabyid-al-asnan-kayfa-yaml' },
  { term: 'التبييض', slug: 'tabyid-al-asnan-kayfa-yaml' },
  { term: 'القشور الخزفية', slug: 'al-qushur-al-khazafiyya-al-finir' },
  { term: 'الفينير', slug: 'al-qushur-al-khazafiyya-al-finir' },
  { term: 'اصفرار الأسنان', slug: 'asbab-isfirar-al-asnan' },

  // implants / restoration
  { term: 'زراعة الأسنان', slug: 'ziraat-al-asnan-ma-hiya' },
  { term: 'الجسور السنّية', slug: 'al-jusur-al-sinniyya' },
  { term: 'أطقم الأسنان', slug: 'atqim-al-asnan' },

  // children
  { term: 'تسنين', slug: 'mata-yabda-al-tasnin' },
  { term: 'الأسنان اللبنية', slug: 'al-asnan-al-labaniyya' },
  { term: 'تقويم الأسنان', slug: 'taqwim-al-asnan-lil-atfal' },
];

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Inject contextual internal links into article body HTML.
 * @param {string} htmlContent - the rendered article HTML
 * @param {string} currentSlug - slug of the article being rendered (no self-links)
 * @returns {string} HTML with contextual links added
 */
export function addContextualLinks(htmlContent, currentSlug) {
  if (!htmlContent) return htmlContent;

  // Don't touch text inside these blocks: headings and existing anchors.
  // We split the HTML into "protected" segments and "linkable" segments.
  // Strategy: process only text that's outside any tag, and skip headings/anchors.

  // Sort terms longest-first so multi-word terms win over their substrings.
  const terms = [...LINK_MAP]
    .filter((t) => t.slug !== currentSlug)
    .sort((a, b) => b.term.length - a.term.length);

  const linkedSlugs = new Set(); // each target article linked at most once
  const linkedTerms = new Set(); // each term linked at most once

  // Tokenize into tags vs text so we never inject inside a tag.
  // Also track whether we're inside a heading or an anchor to skip those.
  const tokens = htmlContent.split(/(<[^>]+>)/g);
  let skipDepth = 0; // >0 means inside <h*> or <a>

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (!tok) continue;

    if (tok.startsWith('<')) {
      const m = tok.match(/^<\s*(\/?)\s*([a-zA-Z0-9]+)/);
      if (m) {
        const closing = m[1] === '/';
        const tag = m[2].toLowerCase();
        const isSkip = tag === 'a' || /^h[1-4]$/.test(tag);
        if (isSkip) {
          if (closing) skipDepth = Math.max(0, skipDepth - 1);
          else if (!tok.endsWith('/>')) skipDepth++;
        }
      }
      continue; // never modify tags themselves
    }

    if (skipDepth > 0) continue; // inside heading or anchor — leave text alone

    // This is plain text outside tags — safe to inject links.
    let text = tok;
    for (const { term, slug } of terms) {
      if (linkedSlugs.has(slug) || linkedTerms.has(term)) continue;
      const re = new RegExp(escapeRegex(term));
      if (re.test(text)) {
        text = text.replace(
          re,
          `<a href="/maqalat/${slug}/" class="text-teal underline decoration-teal-light underline-offset-4">${term}</a>`
        );
        linkedSlugs.add(slug);
        linkedTerms.add(term);
      }
    }
    tokens[i] = text;
  }

  return tokens.join('');
}
