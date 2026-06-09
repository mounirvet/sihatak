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
  { term: 'تقويم الأسنان', slug: 'ma-huwa-taqwim-al-asnan' },

  // deeper concepts (added as the library grew) — longest/most-specific first
  { term: 'التقليح وكشط الجذور', slug: 'al-tanzif-al-amiq-taqlih-kasht' },
  { term: 'التنظيف العميق', slug: 'al-tanzif-al-amiq-taqlih-kasht' },
  { term: 'جيوب اللثة', slug: 'juyub-al-litha' },
  { term: 'خراج الأسنان', slug: 'khurraj-al-asnan-tawari' },
  { term: 'سدّ الشقوق', slug: 'sadd-al-shuqut-al-fissure' },
  { term: 'حساسية الأسنان', slug: 'hasasiyat-al-asnan' },
  { term: 'علاج العصب', slug: 'ilaj-al-asab' },
  { term: 'تيجان الأسنان', slug: 'tijan-al-asnan' },
  { term: 'التاج', slug: 'tijan-al-asnan' },
  { term: 'جفاف الفم', slug: 'jafaf-al-fam' },
  { term: 'ميكروبيوم الفم', slug: 'microbiome-al-fam' },
  { term: 'صرير الأسنان', slug: 'sarir-al-asnan-ind-al-atfal' },
  { term: 'ترقيع العظم', slug: 'tarqi-al-azm-qabl-al-ziraa' },
  { term: 'التهاب ما حول الزرعة', slug: 'iltihab-ma-hawl-al-ziraa' },

  // insights ("الجديد في طب الأسنان") — these point to /jadeed/ not /maqalat/.
  // Marking them type:'insight' lets articles link INTO the insight hubs,
  // which is exactly the link equity those pages were missing.
  { term: 'الذكاء الاصطناعي', slug: 'al-zakaa-al-istinaai-fi-tibb-al-asnan', type: 'insight' },
  { term: 'فلورايد الفضة', slug: 'fluorayd-al-fidda-li-tasawwus-al-atfal', type: 'insight' },
  { term: 'فلورايد الفضّة', slug: 'fluorayd-al-fidda-li-tasawwus-al-atfal', type: 'insight' },
  // ===== Batch added 2026-06-08: new high-intent articles + insights =====
  // longest/most-specific terms first so they win over generic ones
  { term: 'خلع ضرس العقل', slug: 'khala-dirs-al-aql' },
  { term: 'ضرس العقل', slug: 'khala-dirs-al-aql' },
  { term: 'السنخ الجاف', slug: 'khala-al-sin-al-taafi-wa-al-sinkh-al-jaf' },
  { term: 'علاج اللثة بالليزر', slug: 'ilaj-al-litha-bil-laser' },
  { term: 'رائحة الفم الكريهة', slug: 'rayihat-al-fam-al-mustamirra-asbab' },
  { term: 'الزراعة الفورية', slug: 'al-ziraa-al-fawriya-baad-al-khala' },
  { term: 'سنّ متخلخل', slug: 'al-sin-al-mutakharkhil-hal-yumkin-inqadhuh' },
  { term: 'تخلخل الأسنان', slug: 'al-sin-al-mutakharkhil-hal-yumkin-inqadhuh' },
  { term: 'الكلورهيكسيدين', slug: 'ghasul-al-klorhexidine-al-aman' },
  { term: 'النانو-هيدروكسي أباتيت', slug: 'maajun-al-nano-hydroxyapatite', type: 'insight' },
  { term: 'هيدروكسي أباتيت', slug: 'maajun-al-nano-hydroxyapatite', type: 'insight' },
  { term: 'الفرشاة الذكية', slug: 'furshat-al-asnan-al-zakiyya', type: 'insight' },
  // ===== Batch added 2026-06-08 (3rd batch): more high-intent articles + insights =====
  { term: 'التقويم الشفّاف', slug: 'al-taqwim-al-shaffaf-alainer' },
  { term: 'تقويم الكبار', slug: 'taqwim-al-kibar-al-shaffaf-am-al-madani' },
  { term: 'جير الأسنان', slug: 'al-jir-asnan-azalatuh' },
  { term: 'الجير', slug: 'al-jir-asnan-azalatuh' },
  { term: 'ترقيع اللثة', slug: 'tatim-al-litha-al-jirahi' },
  { term: 'تطعيم اللثة', slug: 'tatim-al-litha-al-jirahi' },
  { term: 'الأسنان الدائمة', slug: 'al-asnan-al-daima-al-atfal-mata-tazhar' },
  { term: 'مكمّلات الفلورايد', slug: 'mukammilat-al-fluraid-lil-atfal' },
  { term: 'صرير الأسنان عند الكبار', slug: 'sarir-al-asnan-al-kibar-al-wiqaya' },
  { term: 'الواقي الليلي', slug: 'sarir-al-asnan-al-kibar-al-wiqaya' },
  { term: 'السنّ المتشقّق', slug: 'al-sin-al-mutashaqqiq-alamat' },
  { term: 'سنّ متشقّق', slug: 'al-sin-al-mutashaqqiq-alamat' },
  { term: 'معجون الفحم', slug: 'fahm-tabyid-al-asnan-al-aman' },
  { term: 'السجائر الإلكترونية', slug: 'al-sajayir-al-iliktruniya-wa-sihat-al-fam', type: 'insight' },
  { term: 'الفيب', slug: 'al-sajayir-al-iliktruniya-wa-sihat-al-fam', type: 'insight' },
  // ===== Orthodontics pillar (added 2026-06-08) =====
  { term: 'التقويم المعدني', slug: 'al-taqwim-al-madani-al-taqlidi' },
  { term: 'التقويم الخزفي', slug: 'al-taqwim-al-khazafi' },
  { term: 'التقويم الداخلي', slug: 'al-taqwim-al-dakhili-al-lisani' },
  { term: 'التقويم اللساني', slug: 'al-taqwim-al-dakhili-al-lisani' },
  { term: 'المثبّت', slug: 'al-mathbit-al-ritiner-baad-al-taqwim' },
  { term: 'الريتينر', slug: 'al-mathbit-al-ritiner-baad-al-taqwim' },
  { term: 'تكلفة التقويم', slug: 'taklifat-taqwim-al-asnan' },
  { term: 'سوء الإطباق', slug: 'tashih-al-asnan-al-bariza-wal-adda' },
  { term: 'ازدحام الأسنان', slug: 'ilaj-tazahum-al-asnan-wal-faraghat' },
  // ===== Cosmetic dentistry batch (added 2026-06-09) =====
  { term: 'تجميل الابتسامة', slug: 'tajmil-al-ibtisama-khayarat' },
  { term: 'الربط التجميلي', slug: 'al-rabt-al-tajmili-bonding' },
  { term: 'البوندينغ', slug: 'al-rabt-al-tajmili-bonding' },
  { term: 'اللومينير', slug: 'al-luminir-al-qushur-al-raqiqa' },
  { term: 'نحت الأسنان', slug: 'naht-wa-iadat-tashkil-al-asnan' },
  { term: 'تجميل اللثة', slug: 'tajmil-al-litha-al-ibtisama-al-litawiyya' },
  { term: 'الابتسامة اللثوية', slug: 'tajmil-al-litha-al-ibtisama-al-litawiyya' },
  { term: 'زينة الأسنان', slug: 'zinat-al-asnan-wal-jawahir-al-aman' },
  // ===== Dental emergencies cluster (added 2026-06-09) =====
  { term: 'طوارئ الأسنان', slug: 'tawari-al-asnan-madha-taf3al' },
  { term: 'السن المخلوع', slug: 'al-sin-al-makhlu-isaaf-fawri' },
  { term: 'السن المقلوع', slug: 'al-sin-al-makhlu-isaaf-fawri' },
  { term: 'سن مكسور', slug: 'sin-maksur-isaaf-awwali' },
  { term: 'ألم أسنان شديد', slug: 'alam-asnan-shadid-mufaji-madha-taf3al' },
  // ===== New insights batch (added 2026-06-09) =====
  { term: 'ميكروبيوم الفم', slug: 'al-mikrobiom-al-famawi-abhath', type: 'insight' },
  { term: 'البروبيوتيك', slug: 'al-brobaytik-wa-sihat-al-fam-abhath', type: 'insight' },
  { term: 'لصق الفم', slug: 'lasq-al-fam-athna-al-nawm-al-rauj', type: 'insight' },
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

  // currentSlug may be a plain article slug ("foo") or an insight ("insight:foo").
  // Normalize so we never link a page to itself, whichever type it is.
  let curType = 'article';
  let curSlug = currentSlug;
  if (typeof currentSlug === 'string' && currentSlug.startsWith('insight:')) {
    curType = 'insight';
    curSlug = currentSlug.slice('insight:'.length);
  }

  // Sort terms longest-first so multi-word terms win over their substrings.
  const terms = [...LINK_MAP]
    .filter((t) => {
      const tType = t.type === 'insight' ? 'insight' : 'article';
      return !(tType === curType && t.slug === curSlug); // no self-links
    })
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
    for (const { term, slug, type } of terms) {
      if (linkedSlugs.has(slug) || linkedTerms.has(term)) continue;
      const re = new RegExp(escapeRegex(term));
      if (re.test(text)) {
        const base = type === 'insight' ? '/jadeed' : '/maqalat';
        text = text.replace(
          re,
          `<a href="${base}/${slug}/" class="text-teal underline decoration-teal-light underline-offset-4">${term}</a>`
        );
        linkedSlugs.add(slug);
        linkedTerms.add(term);
      }
    }
    tokens[i] = text;
  }

  return tokens.join('');
}
