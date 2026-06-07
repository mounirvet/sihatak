// Dental terms glossary (مصطلحات) — the entity layer.
//
// Each entry is a defined ENTITY that AI engines can cite as a source of truth.
// Definitions are written "answer-first" (the first sentence fully defines the
// term, so it's directly extractable by AI). Each term links to the cornerstone
// article(s) that cover it in depth, and to related terms — forming an entity graph.
//
// To add a term: add an object below. `slug` becomes /mustalahat/<slug>/.

export const GLOSSARY = [
  {
    slug: 'iltihab-al-litha',
    term: 'التهاب اللثة',
    termEn: 'Gingivitis',
    pillar: 'amrad-al-litha',
    definition:
      'التهاب اللثة هو التهاب يصيب أنسجة اللثة المحيطة بالأسنان، وهو المرحلة الأولى والأكثر شيوعاً من أمراض اللثة. ينتج غالباً عن تراكم البلاك (طبقة البكتيريا اللزجة) عند خط اللثة، ويسبّب احمراراً وتورّماً ونزيفاً عند التنظيف. وهو قابل للعكس تماماً إذا عولج مبكراً بالنظافة الجيدة والتنظيف الاحترافي، لكن إهماله قد يتطوّر إلى التهاب دواعم السن.',
    relatedArticles: ['ma-huwa-iltihab-al-litha', 'limadha-tanzif-lithati'],
    relatedTerms: ['al-balak', 'iltihab-dawaim-al-sin', 'inhisar-al-litha'],
  },
  {
    slug: 'iltihab-dawaim-al-sin',
    term: 'التهاب دواعم السن',
    termEn: 'Periodontitis',
    pillar: 'amrad-al-litha',
    definition:
      'التهاب دواعم السن هو مرحلة متقدّمة وخطيرة من أمراض اللثة، يصيب الأنسجة والعظم الداعمة للأسنان. يحدث عندما يُهمل التهاب اللثة فتمتدّ العدوى إلى ما تحت اللثة، ما يؤدي إلى تكوّن جيوب، وتراجع العظم، وقد ينتهي بفقدان الأسنان. وعلى عكس التهاب اللثة، لا يمكن عكس الضرر العظمي الناتج عنه بالكامل، لكن يمكن إيقاف تطوّره بالعلاج.',
    relatedArticles: ['al-farq-bayna-iltihab-al-litha-wa-dawaim-al-sin', 'ma-huwa-iltihab-al-litha'],
    relatedTerms: ['iltihab-al-litha', 'inhisar-al-litha', 'al-jir'],
  },
  {
    slug: 'al-balak',
    term: 'البلاك (اللويحة الجرثومية)',
    termEn: 'Dental Plaque',
    pillar: 'al-inaya-al-yawmiyya',
    definition:
      'البلاك هو طبقة لزجة عديمة اللون تتكوّن باستمرار على الأسنان، وتتألّف من البكتيريا وبقايا الطعام واللعاب. عندما لا يُزال بالتنظيف المنتظم بالفرشاة والخيط، تُنتج بكتيرياه أحماضاً تهاجم المينا وتسبّب التسوّس، كما تهيّج اللثة وتسبّب التهابها. وإذا بقي دون إزالة، يتصلّب البلاك ويتحوّل إلى جير لا يُزال إلا بالتنظيف الاحترافي.',
    relatedArticles: ['al-tariqa-al-sahiha-li-tanzif-al-asnan', 'ma-huwa-tasawwus-al-asnan'],
    relatedTerms: ['al-jir', 'iltihab-al-litha', 'tasawwus-al-asnan'],
  },
  {
    slug: 'al-jir',
    term: 'الجير (القلح)',
    termEn: 'Tartar / Calculus',
    pillar: 'al-inaya-al-yawmiyya',
    definition:
      'الجير (أو القلح) هو البلاك المتصلّب الذي يتراكم على الأسنان وعند خط اللثة عندما لا يُزال البلاك الطريّ في الوقت المناسب. يكون خشناً ومساميّاً، ما يسهّل تراكم المزيد من البلاك والبكتيريا، ويسبّب تهيّج اللثة والتهابها. ولا يمكن إزالة الجير بالفرشاة والخيط المنزليين؛ بل يحتاج إلى تنظيف احترافي عند طبيب الأسنان.',
    relatedArticles: ['al-tariqa-al-sahiha-li-tanzif-al-asnan'],
    relatedTerms: ['al-balak', 'iltihab-al-litha'],
  },
  {
    slug: 'tasawwus-al-asnan',
    term: 'تسوّس الأسنان',
    termEn: 'Tooth Decay / Caries',
    pillar: 'tasawwus-al-asnan',
    definition:
      'تسوّس الأسنان هو تلف يصيب نسيج السن نتيجة الأحماض التي تنتجها البكتيريا عند تحلّلها للسكريات، ما يؤدي إلى تآكل المينا تدريجياً وتكوّن ثقوب (تجاويف). يبدأ التسوّس صامتاً دون ألم، ثم يتعمّق ليصل إلى العاج فالعصب، مسبّباً الألم والحساسية. وهو قابل للوقاية إلى حدّ كبير بالنظافة والفلورايد وتقليل السكر، ويمكن عكسه في مراحله المبكرة جداً.',
    relatedArticles: ['ma-huwa-tasawwus-al-asnan', 'kayfa-uqif-tasawwus-al-asnan', 'al-alaqa-bayna-al-sukkar-wa-al-tasawwus'],
    relatedTerms: ['al-balak', 'al-fluraid', 'al-mina'],
  },
  {
    slug: 'al-fluraid',
    term: 'الفلورايد',
    termEn: 'Fluoride',
    pillar: 'tasawwus-al-asnan',
    definition:
      'الفلورايد هو معدن طبيعي يقوّي مينا الأسنان ويزيد مقاومتها للأحماض، ما يجعله من أهمّ وسائل الوقاية من تسوّس الأsنان. يعمل بإعادة تمعدن المينا في مراحل التسوّس المبكرة وإبطاء نمو البكتيريا الضارّة. ويوجد في معاجين الأسنان وبعض مياه الشرب وغسولات الفم، ويمكن لطبيب الأسنان تطبيقه بتركيز أعلى للوقاية.',
    relatedArticles: ['dawr-al-fluraid-fil-wiqaya', 'kayfa-akhtar-majun-al-asnan'],
    relatedTerms: ['al-mina', 'tasawwus-al-asnan'],
  },
  {
    slug: 'al-mina',
    term: 'مينا الأسنان',
    termEn: 'Tooth Enamel',
    pillar: 'tasawwus-al-asnan',
    definition:
      'مينا الأسنان هي الطبقة الخارجية الصلبة التي تغطّي السن، وهي أصلب نسيج في جسم الإنسان. تحمي الطبقات الداخلية للسن من التسوّس والحساسية وعوامل التآكل. وعلى عكس معظم أنسجة الجسم، لا تحتوي المينا على خلايا حيّة، لذلك فإنها لا تنمو أو تُصلح نفسها إذا تضرّرت أو تآكلت — ما يجعل حمايتها أمراً دائماً ومهمّاً.',
    relatedArticles: ['hal-al-tabyid-yadurr-al-mina', 'dawr-al-fluraid-fil-wiqaya'],
    relatedTerms: ['al-fluraid', 'tasawwus-al-asnan', 'tabyid-al-asnan'],
  },
  {
    slug: 'inhisar-al-litha',
    term: 'انحسار اللثة',
    termEn: 'Gum Recession',
    pillar: 'amrad-al-litha',
    definition:
      'انحسار اللثة هو تراجع نسيج اللثة عن سطح السن، ما يكشف جذر السن ويجعله يبدو أطول. ينتج عن أسباب متعدّدة كالتنظيف العنيف، وأمراض اللثة، والتدخين، وعوامل وراثية. يسبّب حساسية الأسنان ويزيد خطر التسوّس على الجذر المكشوف. والضرر الناتج عنه دائم غالباً، لذا فإن الوقاية بالتنظيف اللطيف وعلاج أسبابه أمر مهمّ.',
    relatedArticles: ['inhisar-al-litha'],
    relatedTerms: ['iltihab-al-litha', 'iltihab-dawaim-al-sin'],
  },
  {
    slug: 'tabyid-al-asnan',
    term: 'تبييض الأسنان',
    termEn: 'Teeth Whitening',
    pillar: 'tabyid-al-asnan',
    definition:
      'تبييض الأسنان هو إجراء تجميلي يفتّح لون الأسنان عبر مواد مبيّضة (غالباً بيروكسيد الهيدروجين أو الكارباميد) تكسّر جزيئات التصبّغ داخل المينا. وهو آمن عموماً عند إجرائه بإشراف طبيب أسنان أو بمنتجات معتمدة وفق التعليمات. لا يبيّض الحشوات والتركيبات، وقد يسبّب حساسية مؤقتة، ولا تدوم نتيجته للأبد.',
    relatedArticles: ['tabyid-al-asnan-kayfa-yaml', 'hal-al-tabyid-yadurr-al-mina'],
    relatedTerms: ['al-mina', 'al-finir'],
  },
  {
    slug: 'al-finir',
    term: 'القشور الخزفية (الفينير)',
    termEn: 'Dental Veneers',
    pillar: 'tabyid-al-asnan',
    definition:
      'القشور الخزفية (الفينير) هي شرائح رقيقة جداً، غالباً من الخزف، تُلصق على السطح الأمامي للأسنان لتحسين لونها وشكلها وانتظامها. تُستخدم لعلاج التصبّغات العنيدة أو الكسور أو الفراغات. وغالباً ما تتطلّب إزالة طبقة رقيقة من مينا السن، ما يجعلها إجراءً دائماً وغير قابل للتراجع في معظم الأنواع.',
    relatedArticles: ['al-qushur-al-khazafiyya-al-finir', 'ibtisamat-holiwud'],
    relatedTerms: ['al-mina', 'tabyid-al-asnan'],
  },
  {
    slug: 'ziraat-al-asnan',
    term: 'زراعة الأسنان',
    termEn: 'Dental Implant',
    pillar: 'ziraat-al-asnan',
    definition:
      'زراعة الأسنان هي وضع جذر صناعي (غالباً من التيتانيوم) في عظم الفكّ ليحلّ محلّ جذر السن المفقود ويحمل تاجاً يشبه السن الطبيعي. تُعدّ الأقرب للسن الطبيعي شكلاً ووظيفةً، ولا تعتمد على الأسنان المجاورة، وتحافظ على عظم الفكّ. تحتاج إلى عظم كافٍ ولثة سليمة، وتمرّ بمراحل تمتدّ أشهراً حتى تلتحم الزرعة بالعظم.',
    relatedArticles: ['ziraat-al-asnan-ma-hiya', 'tawid-al-asnan-al-mafquda'],
    relatedTerms: ['al-jusur-al-sinniyya'],
  },
  {
    slug: 'al-jusur-al-sinniyya',
    term: 'الجسور السنّية',
    termEn: 'Dental Bridge',
    pillar: 'ziraat-al-asnan',
    definition:
      'الجسر السنّي هو تركيبة ثابتة تعوّض سنّاً مفقوداً أو أكثر، عبر تاج بديل يستند على الأسنان المجاورة (الدعامات) التي تُبرد وتُغطّى بتيجان. يتميّز بأنه أسرع وأقلّ تكلفة من الزراعة ولا يحتاج جراحة، لكنه يتطلّب برد أسنان مجاورة سليمة ولا يمنع فقدان العظم تحت السن المفقود.',
    relatedArticles: ['al-jusur-al-sinniyya', 'ziraat-al-asnan-muqabil-al-jisr'],
    relatedTerms: ['ziraat-al-asnan'],
  },
  {
    slug: 'al-tasnin',
    term: 'التسنين',
    termEn: 'Teething',
    pillar: 'asnan-al-atfal',
    definition:
      'التسنين هو عملية بزوغ الأسنان اللبنية عبر لثة الطفل الرضيع، وتبدأ غالباً بين الشهر السادس والسنة الأولى. قد يصاحبها تهيّج، وزيادة في اللعاب، ورغبة في العضّ، وانزعاج خفيف. وهي مرحلة طبيعية في نموّ الطفل، ويمكن تخفيف انزعاجها بوسائل آمنة كعضّاضات التسنين الباردة وتدليك اللثة.',
    relatedArticles: ['mata-yabda-al-tasnin', 'dalil-al-inaya-bi-asnan-al-atfal'],
    relatedTerms: ['al-asnan-al-labaniyya'],
  },
  {
    slug: 'al-asnan-al-labaniyya',
    term: 'الأسنان اللبنية',
    termEn: 'Primary / Baby Teeth',
    pillar: 'asnan-al-atfal',
    definition:
      'الأسنان اللبنية هي المجموعة الأولى من أسنان الطفل، وعددها 20 سنّاً، تبدأ بالظهور في مرحلة الرضاعة وتُستبدل تدريجياً بالأسنان الدائمة. رغم أنها مؤقتة، فهي مهمّة جداً للمضغ والنطق وحجز المكان للأسنان الدائمة، لذا فإن العناية بها والوقاية من تسوّسها ضرورية ولا يصحّ إهمالها بحجّة أنها ستسقط.',
    relatedArticles: ['al-asnan-al-labaniyya', 'dalil-al-inaya-bi-asnan-al-atfal'],
    relatedTerms: ['al-tasnin'],
  },
];

export function getGlossaryTerm(slug) {
  return GLOSSARY.find((t) => t.slug === slug) || null;
}

export function getGlossarySlugs() {
  return GLOSSARY.map((t) => t.slug);
}
