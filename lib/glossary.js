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
      'الفلورايد هو معدن طبيعي يقوّي مينا الأسنان ويزيد مقاومتها للأحماض، ما يجعله من أهمّ وسائل الوقاية من تسوّس الأسنان. يعمل بإعادة تمعدن المينا في مراحل التسوّس المبكرة وإبطاء نمو البكتيريا الضارّة. ويوجد في معاجين الأسنان وبعض مياه الشرب وغسولات الفم، ويمكن لطبيب الأسنان تطبيقه بتركيز أعلى للوقاية.',
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

  // ============================================================
  // NEW CLINICAL TERMS - added 2026-06-09 (38 net-new entities)
  // relatedArticles auto-filter to existing articles at build
  // time, so refs to not-yet-published batches are skipped
  // safely and light up once those batches are live.
  // ============================================================
  {
    slug: 'al-hashwa-al-sinniyya',
    term: 'الحشوة السنّية',
    termEn: 'Dental Filling',
    pillar: 'tasawwus-al-asnan',
    synonyms: ['حشو الأسنان'],
    definition:
      'الحشوة السنّية هي مادة تُستخدم لترميم سن متضرّر من التسوّس بعد إزالة الجزء المتسوّس، لإعادة شكله ووظيفته. تُصنع من موادّ مختلفة مثل الكومبوزيت بلون السن أو الأملغم، ويختار الطبيب النوع حسب موقع السن وحجم التسوّس. الحشوة توقف تقدّم التسوّس وتحمي السن، لكن السن المرمّم يبقى بحاجة لنظافة دقيقة عند حواف الحشوة.',
    relatedArticles: ['hashw-al-asnan-al-marahil-wal-anwa', 'al-tasawwus-hawl-al-hashwat-wal-tijan'],
    relatedTerms: ['tasawwus-al-asnan', 'al-taj-al-sinni'],
  },
  {
    slug: 'al-taj-al-sinni',
    term: 'التاج السنّي',
    termEn: 'Dental Crown',
    pillar: 'ziraat-al-asnan',
    synonyms: ['تلبيسة السن', 'الكراون'],
    definition:
      'التاج السنّي هو غطاء يُركّب على سن متضرّر بشدّة ليغلّفه بالكامل ويعيد شكله وقوته ومظهره. يُستخدم عند تضرّر السن بحيث لا تكفي الحشوة، أو بعد علاج العصب، أو لتغطية زرعة. يُصنع من موادّ كالخزف أو المعدن أو مزيج منهما. التاج يحمي السن ويستعيد وظيفته، لكن السن الطبيعي تحته واللثة حوله يحتاجان عناية مستمرّة.',
    relatedArticles: ['tijan-al-asnan', 'al-tasawwus-hawl-al-hashwat-wal-tijan'],
    relatedTerms: ['al-hashwa-al-sinniyya', 'ilaj-al-asab-lubb-al-sin', 'al-jusur-al-sinniyya'],
  },
  {
    slug: 'ilaj-al-asab-lubb-al-sin',
    term: 'علاج العصب (لبّ السن)',
    termEn: 'Root Canal Treatment',
    pillar: 'tasawwus-al-asnan',
    synonyms: ['سحب العصب', 'علاج قناة الجذر'],
    definition:
      'علاج العصب هو إجراء لإزالة لبّ السن الملتهب أو المصاب (العصب والأوعية داخل السن) وتنظيف قنوات الجذر وحشوها، لإنقاذ السن بدل خلعه. يُلجأ إليه عند وصول التسوّس أو العدوى أو الكسر إلى لبّ السن مسبّباً ألماً أو خراجاً. بعد العلاج، يُغطّى السن غالباً بتاج لحمايته. الإجراء يحفظ السن الطبيعي ويزيل مصدر الألم والعدوى.',
    relatedArticles: ['ilaj-al-asab', 'khala-am-ilaj-asab'],
    relatedTerms: ['lubb-al-sin', 'al-khurraj-al-sinni', 'al-taj-al-sinni'],
  },
  {
    slug: 'lubb-al-sin',
    term: 'لبّ السن',
    termEn: 'Dental Pulp',
    pillar: 'tasawwus-al-asnan',
    synonyms: ['عصب السن'],
    definition:
      'لبّ السن هو النسيج الحيّ داخل السن، ويحتوي على الأعصاب والأوعية الدموية التي تغذّيه وتمنحه الإحساس. يقع في حجرة وسط السن وتمتدّ امتداداته في قنوات الجذور. عندما يصل التسوّس أو الكسر إلى اللبّ، قد يلتهب ويسبّب ألماً شديداً، ويحتاج عندها لعلاج العصب أو خلع السن. صحة اللبّ أساسية لبقاء السن حيّاً.',
    relatedArticles: ['ilaj-al-asab'],
    relatedTerms: ['ilaj-al-asab-lubb-al-sin', 'al-asab-al-sinni', 'al-khurraj-al-sinni'],
  },
  {
    slug: 'al-khurraj-al-sinni',
    term: 'الخُراج السنّي',
    termEn: 'Dental Abscess',
    pillar: 'tasawwus-al-asnan',
    synonyms: ['خراج الأسنان', 'الدمّل السنّي'],
    definition:
      'الخُراج السنّي هو تجمّع للصديد ناتج عن عدوى بكتيرية في السن أو اللثة أو العظم المحيط. يحدث غالباً نتيجة تسوّس عميق غير معالَج أو كسر يصل للبّ السن، ويسبّب ألماً شديداً وتورّماً وأحياناً حمّى. الخُراج حالة تستدعي علاجاً سريعاً لأنه قد ينتشر، ويُعالَج بتصريف العدوى وعلاج العصب أو خلع السن مع مضاد حيوي عند الحاجة.',
    relatedArticles: ['khurraj-al-asnan-tawari', 'khurraj-al-litha'],
    relatedTerms: ['lubb-al-sin', 'ilaj-al-asab-lubb-al-sin', 'tasawwus-al-asnan'],
  },
  {
    slug: 'hassasiyat-al-asnan-mustalah',
    term: 'حساسية الأسنان',
    termEn: 'Dentin Hypersensitivity',
    pillar: 'tasawwus-al-asnan',
    synonyms: ['تحسّس الأسنان'],
    definition:
      'حساسية الأسنان هي ألم خاطف وقصير يحدث عند تعرّض الأسنان لمحفّزات كالبارد أو الساخن أو الحلو أو الحمضي. تنتج عادة عن انكشاف طبقة العاج تحت المينا، بسبب تآكل المينا أو انحسار اللثة أو تسوّس أو سن متصدّع. قد تكون عابرة أو علامة على مشكلة تحتاج علاجاً. تُدار بمعجون مخصّص وتفريش لطيف، مع تحديد السبب عند الطبيب.',
    relatedArticles: ['hasasiyat-al-asnan', 'hasasiyat-al-asnan-al-mufajia-asbab'],
    relatedTerms: ['al-mina', 'al-aaj-al-sinni', 'inhisar-al-litha'],
  },
  {
    slug: 'al-aaj-al-sinni',
    term: 'العاج السنّي',
    termEn: 'Dentin',
    pillar: 'tasawwus-al-asnan',
    synonyms: ['العاج'],
    definition:
      'العاج هو الطبقة الموجودة تحت مينا الأسنان، وهو أليّن من المينا ويشكّل الجزء الأكبر من بنية السن. يحتوي على قنوات دقيقة تصل إلى لبّ السن، ولهذا فإن انكشافه (بتآكل المينا أو انحسار اللثة) يسبّب حساسية الأسنان. وبما أنه أقلّ صلابة من المينا، ينتشر فيه التسوّس أسرع عند وصوله إليه. حماية المينا تحمي العاج من الانكشاف.',
    relatedArticles: ['hasasiyat-al-asnan'],
    relatedTerms: ['al-mina', 'hassasiyat-al-asnan-mustalah', 'lubb-al-sin'],
  },
  {
    slug: 'izalat-al-tamadun',
    term: 'إزالة التمعدن',
    termEn: 'Demineralization',
    pillar: 'tasawwus-al-asnan',
    synonyms: ['فقدان معادن المينا'],
    definition:
      'إزالة التمعدن هي فقدان المعادن (كالكالسيوم والفوسفات) من مينا الأسنان بفعل الأحماض التي تنتجها بكتيريا البلاك من السكّر. وهي المرحلة الأولى من التسوّس، وتظهر غالباً كبقعة بيضاء قبل تشكّل التجويف. في هذه المرحلة، يكون الضرر قابلاً للعكس عبر إعادة التمعدن بالفلورايد وتحسين النظافة، قبل أن يتطوّر إلى تجويف يحتاج حشواً.',
    relatedArticles: ['buqa-bayda-ala-al-asnan-bidayat-tasawwus', 'marahil-tasawwus-al-asnan-bil-tafsil'],
    relatedTerms: ['iadat-al-tamadun-mustalah', 'al-mina', 'tasawwus-al-asnan'],
  },
  {
    slug: 'iadat-al-tamadun-mustalah',
    term: 'إعادة التمعدن',
    termEn: 'Remineralization',
    pillar: 'tasawwus-al-asnan',
    synonyms: ['إعادة بناء المينا'],
    definition:
      'إعادة التمعدن هي عملية استعادة المعادن المفقودة من مينا الأسنان، بمساعدة اللعاب والفلورايد. وهي الآلية الطبيعية التي يصلح بها الجسم الضرر المبكر للمينا (إزالة التمعدن) قبل تشكّل التجويف. الفلورايد يعزّز هذه العملية، ولهذا يمكن للبقع البيضاء المبكرة أن تُوقَف بل تتحسّن. إعادة التمعدن ممكنة قبل تشكّل التجويف فقط؛ بعده يلزم الترميم.',
    relatedArticles: ['iadat-al-tamadun-al-asnan', 'buqa-bayda-ala-al-asnan-bidayat-tasawwus'],
    relatedTerms: ['izalat-al-tamadun', 'al-fluraid', 'al-mina'],
  },
  {
    slug: 'sadd-al-shuqut-mustalah',
    term: 'سدّ الشقوق',
    termEn: 'Dental Sealant',
    pillar: 'asnan-al-atfal',
    synonyms: ['الحاجز الوقائي', 'السيلانت'],
    definition:
      'سدّ الشقوق هو طبقة واقية رقيقة تُطبّق على الأسطح الماضغة للأضراس الخلفية لملء أخاديدها العميقة ومنع تراكم البكتيريا والطعام فيها. يُستخدم خاصة عند الأطفال للوقاية من تسوّس الأضراس، حيث يصعب تنظيف هذه الأخاديد بالفرشاة. الإجراء سريع وغير مؤلم، ويوفّر حماية إضافية فوق التنظيف اليومي والفلورايد.',
    relatedArticles: ['asnan-al-qirsh-al-atfal', 'al-himaya-min-tasawwus-al-atfal-yawmiyyan'],
    relatedTerms: ['al-fluraid', 'tasawwus-al-asnan'],
  },
  {
    slug: 'sou-al-itbaq',
    term: 'سوء الإطباق',
    termEn: 'Malocclusion',
    pillar: 'taqwim-al-asnan',
    synonyms: ['اختلال الإطباق'],
    definition:
      'سوء الإطباق هو عدم انتظام في اصطفاف الأسنان أو في طريقة التقاء الفكّين عند الإطباق. يشمل الازدحام، والفراغات، وبروز الأسنان، والعضّة العميقة أو المفتوحة أو المعكوسة. قد يؤثّر على المضغ والنطق وتنظيف الأسنان، ويزيد خطر التسوّس وأمراض اللثة وإجهاد الفك. يُعالَج غالباً بالتقويم، ويحدّد الأخصائي درجته والخطة المناسبة له.',
    relatedArticles: ['tashih-al-asnan-al-bariza-wal-adda', 'ilaj-tazahum-al-asnan-wal-faraghat'],
    relatedTerms: ['taqwim-al-asnan-mustalah', 'al-mathbit-mustalah'],
  },
  {
    slug: 'taqwim-al-asnan-mustalah',
    term: 'تقويم الأسنان',
    termEn: 'Orthodontics / Braces',
    pillar: 'taqwim-al-asnan',
    synonyms: ['التقويم السنّي'],
    definition:
      'تقويم الأسنان هو فرع وعلاج يهدف إلى تصحيح اصطفاف الأسنان والإطباق عبر تحريك الأسنان تدريجياً إلى مواضعها الصحيحة. يستخدم وسائل كالأقواس المعدنية أو الخزفية أو القوالب الشفافة. يعالج الازدحام والفراغات والبروز وسوء الإطباق، محسّناً المظهر والوظيفة وصحة الفم. مدّته تختلف حسب الحالة، ويتبعه ارتداء مثبّت للحفاظ على النتيجة.',
    relatedArticles: ['ma-huwa-taqwim-al-asnan', 'anwa-taqwim-al-asnan'],
    relatedTerms: ['sou-al-itbaq', 'al-mathbit-mustalah', 'al-taqwim-al-shaffaf-mustalah'],
  },
  {
    slug: 'al-taqwim-al-shaffaf-mustalah',
    term: 'التقويم الشفاف',
    termEn: 'Clear Aligners',
    pillar: 'taqwim-al-asnan',
    synonyms: ['الألاينر', 'القوالب الشفافة'],
    definition:
      'التقويم الشفاف هو سلسلة من القوالب البلاستيكية الشفافة القابلة للإزالة، تُصمّم خصيصاً لتحريك الأسنان تدريجياً نحو اصطفاف أفضل. يُستبدل كل قالب بآخر كل فترة، ويُرتدى 20-22 ساعة يومياً ويُخلع للأكل والتنظيف. ميزته أنه شبه خفيّ ومريح، لكنه يعتمد على التزام المريض ويناسب الحالات البسيطة إلى المتوسطة غالباً.',
    relatedArticles: ['al-taqwim-al-shaffaf-alainer', 'kam-saa-albas-al-alainer-yawmiyyan'],
    relatedTerms: ['taqwim-al-asnan-mustalah', 'al-mathbit-mustalah', 'sou-al-itbaq'],
  },
  {
    slug: 'al-mathbit-mustalah',
    term: 'المثبّت (الريتينر)',
    termEn: 'Retainer',
    pillar: 'taqwim-al-asnan',
    synonyms: ['الريتينر', 'مثبّت التقويم'],
    definition:
      'المثبّت هو جهاز يُرتدى بعد انتهاء التقويم للحفاظ على الأسنان في مواضعها الجديدة ومنعها من العودة لوضعها السابق. قد يكون متحرّكاً (شفافاً أو سلكياً) أو ثابتاً يُلصق خلف الأسنان. ارتداؤه كما يصف الطبيب ضروري، لأن إهماله قد يفقد نتيجة التقويم. المثبّت يحفظ استثمار شهور أو سنوات من العلاج.',
    relatedArticles: ['al-mathbit-al-ritiner-baad-al-taqwim', 'al-inaya-bil-mathbit-al-shaffaf-ritiner'],
    relatedTerms: ['taqwim-al-asnan-mustalah', 'al-taqwim-al-shaffaf-mustalah'],
  },
  {
    slug: 'juyub-al-litha-mustalah',
    term: 'جيوب اللثة',
    termEn: 'Periodontal Pockets',
    pillar: 'amrad-al-litha',
    synonyms: ['الجيوب اللثوية'],
    definition:
      'جيوب اللثة هي فراغات تتكوّن بين السن واللثة عندما تنفصل اللثة عن السن بسبب التهاب دواعم السن المتقدّم. كلما زاد عمق الجيب، دلّ ذلك على تطوّر المرض وفقدان العظم الداعم. تتجمّع في هذه الجيوب البكتيريا ويصعب تنظيفها، ما يفاقم العدوى. يقيس الطبيب عمقها لتقييم صحة اللثة، وتُعالَج بالتنظيف العميق وأحياناً الجراحة.',
    relatedArticles: ['juyub-al-litha', 'al-tanzif-al-amiq-taqlih-kasht'],
    relatedTerms: ['iltihab-dawaim-al-sin', 'al-tanzif-al-amiq-mustalah', 'inhisar-al-litha'],
  },
  {
    slug: 'al-tanzif-al-amiq-mustalah',
    term: 'التنظيف العميق (التقليح والكشط)',
    termEn: 'Scaling and Root Planing',
    pillar: 'amrad-al-litha',
    synonyms: ['التقليح وتسوية الجذور'],
    definition:
      'التنظيف العميق هو إجراء غير جراحي لعلاج أمراض اللثة، يشمل إزالة الجير والبلاك من فوق وتحت خط اللثة (التقليح)، وتنعيم أسطح الجذور (الكشط) لمساعدة اللثة على الالتئام. يُستخدم عند تكوّن جيوب اللثة والتهاب دواعم السن، ويختلف عن التنظيف الاعتيادي بوصوله تحت اللثة. قد يحتاج جلسات وتخديراً موضعياً حسب الحالة.',
    relatedArticles: ['al-tanzif-al-amiq-taqlih-kasht'],
    relatedTerms: ['juyub-al-litha-mustalah', 'iltihab-dawaim-al-sin', 'al-jir'],
  },
  {
    slug: 'nazif-al-litha-mustalah',
    term: 'نزيف اللثة',
    termEn: 'Gum Bleeding',
    pillar: 'amrad-al-litha',
    synonyms: ['نزف اللثة'],
    definition:
      'نزيف اللثة هو خروج دم من اللثة، غالباً عند التنظيف بالفرشاة أو الخيط، وهو ليس طبيعياً بل علامة شائعة على التهاب اللثة المبكر الناتج عن تراكم البلاك. اللثة السليمة لا تنزف عادة عند التنظيف اللطيف. النزيف غالباً قابل للعكس بتحسين النظافة، لكن استمراره أو حدوثه تلقائياً يستدعي تقييم الطبيب لاستبعاد أسباب أعمق.',
    relatedArticles: ['hal-nazif-al-litha-tabii-am-indhar', 'mata-yastadi-nazif-al-litha-ziyarat-al-tabib'],
    relatedTerms: ['iltihab-al-litha', 'al-balak', 'alamat-amrad-al-litha-mustalah'],
  },
  {
    slug: 'khat-al-litha',
    term: 'خط اللثة',
    termEn: 'Gumline',
    pillar: 'al-inaya-al-yawmiyya',
    synonyms: ['حدّ اللثة'],
    definition:
      'خط اللثة هو الموضع الذي تلتقي فيه اللثة بالسن. وهو منطقة بالغة الأهمية لصحة الفم، لأن البلاك يتراكم عندها بكثرة ويسبّب التهاب اللثة إن لم يُزَل. التنظيف الفعّال يجب أن يستهدف خط اللثة تحديداً بفرشاة موجّهة بزاوية نحوه. إهمال هذه المنطقة هو سبب رئيسي لأمراض اللثة، بينما تنظيفها الجيّد أساس الوقاية.',
    relatedArticles: ['tiqniyat-tafrish-li-sihhat-al-litha', 'rutin-yawmi-li-litha-salima'],
    relatedTerms: ['al-balak', 'iltihab-al-litha', 'inhisar-al-litha'],
  },
  {
    slug: 'alamat-amrad-al-litha-mustalah',
    term: 'أعراض أمراض اللثة',
    termEn: 'Gum Disease Symptoms',
    pillar: 'amrad-al-litha',
    synonyms: ['علامات التهاب اللثة'],
    definition:
      'أعراض أمراض اللثة هي العلامات التي تدلّ على التهابها، وتشمل احمرار اللثة وتورّمها، ونزيفها عند التنظيف، وتغيّر لونها، ورائحة الفم المستمرّة، وانحسار اللثة، وفي المراحل المتقدّمة تخلخل الأسنان. كثير من هذه الأعراض المبكرة بلا ألم، ولهذا تُهمل. ملاحظتها مبكراً تتيح علاجاً قابلاً للعكس قبل تطوّر المرض.',
    relatedArticles: ['alamat-mubakkira-li-amrad-al-litha', 'ma-huwa-iltihab-al-litha'],
    relatedTerms: ['iltihab-al-litha', 'nazif-al-litha-mustalah', 'inhisar-al-litha'],
  },
  {
    slug: 'khayt-al-asnan-mustalah',
    term: 'خيط الأسنان',
    termEn: 'Dental Floss',
    pillar: 'al-inaya-al-yawmiyya',
    synonyms: ['الخيط السنّي'],
    definition:
      'خيط الأسنان هو خيط رفيع يُستخدم لتنظيف ما بين الأسنان وعند خط اللثة، حيث لا تصل فرشاة الأسنان. يزيل البلاك وبقايا الطعام من هذه المناطق التي تُعدّ من أكثر مواضع التسوّس والتهاب اللثة. يُنصح باستخدامه مرة يومياً على الأقل، ويفضّل قبل النوم. الخيط جزء أساسي من النظافة اليومية لا إجراء كمالي.',
    relatedArticles: ['kayfa-astakhdim-khayt-al-asnan', 'al-khayt-wa-sihhat-al-litha'],
    relatedTerms: ['al-balak', 'khat-al-litha', 'iltihab-al-litha'],
  },
  {
    slug: 'jafaf-al-fam-mustalah',
    term: 'جفاف الفم',
    termEn: 'Xerostomia / Dry Mouth',
    pillar: 'al-inaya-al-yawmiyya',
    synonyms: ['نقص اللعاب'],
    definition:
      'جفاف الفم هو نقص في إفراز اللعاب يجعل الفم جافاً، وهو ليس مجرّد إزعاج بل عامل خطر لصحة الفم. فاللعاب يحمي الأسنان بغسل البقايا ومعادلة الأحماض وإعادة بناء المينا، لذا قلّته ترفع خطر التسوّس وأمراض اللثة. أسبابه تشمل بعض الأدوية، والجفاف، وحالات طبية. يُدار بالترطيب وتحفيز اللعاب ومعالجة السبب.',
    relatedArticles: ['jafaf-al-fam', 'al-luaab-wa-himayat-al-asnan-min-al-tasawwus'],
    relatedTerms: ['al-luaab-mustalah', 'tasawwus-al-asnan', 'iltihab-al-litha'],
  },
  {
    slug: 'al-luaab-mustalah',
    term: 'اللعاب',
    termEn: 'Saliva',
    pillar: 'al-inaya-al-yawmiyya',
    synonyms: ['الريق'],
    definition:
      'اللعاب هو السائل الذي تفرزه الغدد اللعابية في الفم، ويؤدّي دوراً وقائياً أساسياً لصحة الأسنان. فهو يغسل بقايا الطعام والبكتيريا، ويعادل الأحماض التي تهاجم المينا، ويزوّد الأسنان بالمعادن لإعادة بنائها. كما يساعد على المضغ والبلع والتذوّق. قلّة اللعاب (جفاف الفم) تضعف هذه الحماية وترفع خطر التسوّس وأمراض اللثة.',
    relatedArticles: ['al-luaab-wa-himayat-al-asnan-min-al-tasawwus', 'jafaf-al-fam'],
    relatedTerms: ['jafaf-al-fam-mustalah', 'iadat-al-tamadun-mustalah', 'al-mina'],
  },
  {
    slug: 'rayihat-al-fam-mustalah',
    term: 'رائحة الفم الكريهة',
    termEn: 'Halitosis / Bad Breath',
    pillar: 'al-inaya-al-yawmiyya',
    synonyms: ['البخر', 'نتن النفس'],
    definition:
      'رائحة الفم الكريهة (البخر) هي رائحة غير مستحبّة تخرج من الفم، وغالباً ما تنتج عن تراكم البكتيريا على اللسان والأسنان، أو أمراض اللثة، أو جفاف الفم، أو بقايا الطعام. قد ترتبط أيضاً بأسباب خارج الفم. تُعالَج عادة بتحسين النظافة وتنظيف اللسان وعلاج سببها. استمرارها رغم النظافة الجيدة يستدعي تقييم الطبيب لتحديد السبب.',
    relatedArticles: ['rayihat-al-fam-al-mustamirra-asbab', 'raihat-al-fam-wa-amrad-al-litha'],
    relatedTerms: ['al-balak', 'iltihab-al-litha', 'kasht-al-lisan-mustalah'],
  },
  {
    slug: 'kasht-al-lisan-mustalah',
    term: 'تنظيف اللسان',
    termEn: 'Tongue Cleaning',
    pillar: 'al-inaya-al-yawmiyya',
    synonyms: ['كشط اللسان'],
    definition:
      'تنظيف اللسان هو إزالة الطبقة من البكتيريا وبقايا الطعام التي تتراكم على سطح اللسان، باستخدام كاشطة اللسان أو الفرشاة. يساعد على تقليل رائحة الفم وتحسين النظافة العامة، لأن اللسان يأوي جزءاً كبيراً من بكتيريا الفم. يُعدّ خطوة مكمّلة للتفريش والخيط في الروتين اليومي، لا بديلاً عنهما.',
    relatedArticles: ['al-inaya-bil-lisan', 'kasht-al-lisan'],
    relatedTerms: ['rayihat-al-fam-mustalah', 'al-balak'],
  },
  {
    slug: 'al-furshat-al-kahrabaiyya-mustalah',
    term: 'فرشاة الأسنان الكهربائية',
    termEn: 'Electric Toothbrush',
    pillar: 'al-inaya-al-yawmiyya',
    synonyms: ['الفرشاة الكهربائية'],
    definition:
      'فرشاة الأسنان الكهربائية هي فرشاة تعتمد على حركة آلية (دورانية أو ذبذبية) لتنظيف الأسنان، وقد تساعد على إزالة البلاك بفعالية وتسهّل التنظيف لمن يجدون صعوبة في التقنية اليدوية أو حركة اليد. بعض أنواعها ينبّه عند الضغط الزائد الذي يضرّ اللثة. لكن الفرشاة اليدوية بتقنية صحيحة فعّالة أيضاً؛ فالتقنية والانتظام أهمّ من نوع الفرشاة.',
    relatedArticles: ['al-furshat-al-yadawiyya-am-al-kahrabaiyya', 'al-furshat-al-kahrabaiyya-wa-sihhat-al-litha'],
    relatedTerms: ['al-balak', 'khat-al-litha'],
  },
  {
    slug: 'al-bakteria-al-famawiyya',
    term: 'بكتيريا الفم',
    termEn: 'Oral Bacteria',
    pillar: 'al-inaya-al-yawmiyya',
    synonyms: ['جراثيم الفم', 'ميكروبيوم الفم'],
    definition:
      'بكتيريا الفم هي مجموعة الكائنات الدقيقة التي تعيش طبيعياً في الفم، وبعضها مفيد وبعضها قد يضرّ. عندما تتراكم بكتيريا معيّنة في البلاك وتتغذّى على السكّر، تنتج أحماضاً تسبّب التسوّس، أو تهيّج اللثة فتسبّب التهابها. الحفاظ على توازن صحّي لبكتيريا الفم عبر النظافة وتقليل السكّر أساس الوقاية من أمراض الفم.',
    relatedArticles: ['al-baktiria-wal-balak-wa-bidayat-amrad-al-litha', 'al-himaya-min-al-tasawwus-al-atfal-yawmiyyan'],
    relatedTerms: ['al-balak', 'tasawwus-al-asnan', 'iltihab-al-litha'],
  },
  {
    slug: 'al-rabt-al-tajmili-mustalah',
    term: 'الربط التجميلي (البوندينج)',
    termEn: 'Dental Bonding',
    pillar: 'tabyid-al-asnan',
    synonyms: ['البوندينج', 'الترميم التجميلي بالكومبوزيت'],
    definition:
      'الربط التجميلي هو إجراء يضيف فيه الطبيب مادة بلون السن (كومبوزيت) ويشكّلها مباشرة على السن لإصلاح كسر بسيط أو فراغ صغير أو تصبّغ محدود أو تعديل الشكل. يُنجز غالباً في جلسة واحدة، وهو أقل تكلفة وأكثر محافظة من الفينير لأنه يتطلّب برداً أقل أو لا برد. لكنه أقل متانة ومقاومة للتصبّغ من الخزف، وأسهل إصلاحاً.',
    relatedArticles: ['al-finir-muqabil-al-bonding-ayyuhuma', 'islah-sin-amami-maksur-khayarat'],
    relatedTerms: ['al-finir', 'tabyid-al-asnan'],
  },
  {
    slug: 'al-finir-mustalah',
    term: 'الفينير (القشور الخزفية)',
    termEn: 'Veneers',
    pillar: 'tabyid-al-asnan',
    synonyms: ['القشور التجميلية', 'اللومينير'],
    definition:
      'الفينير هو قشرة رقيقة، غالباً من الخزف، تُلصق على السطح الأمامي للسن لتحسين لونه وشكله وحجمه. يُستخدم لعلاج التصبّغ، والكسور البسيطة، والفراغات الصغيرة، وعدم انتظام الشكل. الفينير التقليدي يتطلّب برد طبقة من المينا فيُعدّ دائماً عملياً. يمنح نتيجة جمالية متينة ومقاومة للتصبّغ، لكنه يحتاج عناية ومتابعة كالأسنان الطبيعية.',
    relatedArticles: ['hal-al-finir-daim-am-qabil-lil-izala', 'al-inaya-bil-finir-ala-al-mada-al-tawil'],
    relatedTerms: ['al-rabt-al-tajmili-mustalah', 'tabyid-al-asnan', 'al-mina'],
  },
  {
    slug: 'al-tasabbugh-al-sinni',
    term: 'تصبّغ الأسنان',
    termEn: 'Tooth Discoloration / Staining',
    pillar: 'tabyid-al-asnan',
    synonyms: ['اصفرار الأسنان', 'بقع الأسنان'],
    definition:
      'تصبّغ الأسنان هو تغيّر لونها عن الطبيعي، وقد يكون سطحياً (من الطعام والمشروبات الملوّنة والتدخين) أو داخلياً (من العمر أو بعض الأدوية أو إصابة السن). التصبّغ السطحي يستجيب غالباً للتنظيف والتبييض، بينما الداخلي قد يحتاج حلولاً تجميلية كالفينير. تحديد نوع التصبّغ يحدّد العلاج المناسب، ويقيّمه طبيب الأسنان.',
    relatedArticles: ['tabyid-al-asnan-lil-murahiqin'],
    relatedTerms: ['tabyid-al-asnan', 'al-finir', 'al-mina'],
  },
  {
    slug: 'taqm-al-asnan-mustalah',
    term: 'طقم الأسنان',
    termEn: 'Dentures',
    pillar: 'ziraat-al-asnan',
    synonyms: ['أطقم الأسنان', 'الطقم المتحرّك'],
    definition:
      'طقم الأسنان هو تعويض متحرّك يعوّض الأسنان المفقودة، وقد يكون كاملاً (يعوّض كل أسنان الفك) أو جزئياً (يعوّض بعضها). يستعيد القدرة على المضغ والكلام والمظهر، ويُزال للتنظيف وأثناء النوم. يحتاج عناية يومية بتنظيفه وتنظيف الفم، وقد يتطلّب تعديلاً دورياً مع تغيّر اللثة والعظم. هو خيار تعويضي شائع خاصة عند فقدان عدّة أسنان.',
    relatedArticles: ['al-inaya-bi-taqm-al-asnan-al-mutaharrik'],
    relatedTerms: ['al-jusur-al-sinniyya', 'ziraat-al-asnan'],
  },
  {
    slug: 'khala-al-sin-mustalah',
    term: 'خلع السن',
    termEn: 'Tooth Extraction',
    pillar: 'tasawwus-al-asnan',
    synonyms: ['قلع السن', 'نزع السن'],
    definition:
      'خلع السن هو إزالة سن من تجويفه في عظم الفك، ويُلجأ إليه عند تعذّر إنقاذ السن بسبب تسوّس شديد أو كسر أو عدوى أو ازدحام يتطلّب مساحة للتقويم. بعد الخلع، تتكوّن جلطة دموية ضرورية للشفاء يجب حمايتها. قد يحتاج الفراغ لتعويض لاحق لمنع ميل الأسنان المجاورة. يتبع الخلع تعليمات عناية لضمان تعافٍ سليم.',
    relatedArticles: ['al-inaya-bil-asnan-baad-khala-al-sin'],
    relatedTerms: ['al-khurraj-al-sinni', 'al-jusur-al-sinniyya', 'ziraat-al-asnan'],
  },
  {
    slug: 'hafiz-al-masafa',
    term: 'حافظ المساحة',
    termEn: 'Space Maintainer',
    pillar: 'asnan-al-atfal',
    synonyms: ['حافظة المسافة'],
    definition:
      'حافظ المساحة هو جهاز صغير يُركّب للطفل بعد فقدان سن لبني مبكراً، ليبقي المكان مفتوحاً للسن الدائم القادم ويمنع ميل الأسنان المجاورة نحو الفراغ. فقدان السن اللبني قبل أوانه قد يضيّق المساحة ويسبّب ازدحام الأسنان الدائمة. الحافظ يحفظ هذه المساحة حتى بزوغ السن الدائم. يحدّد طبيب أسنان الأطفال الحاجة إليه ونوعه.',
    relatedArticles: ['khala-sin-labani-lil-tifl-mata', 'faqdan-al-sin-al-labani-mubakkiran'],
    relatedTerms: ['al-asnan-al-labaniyya', 'sou-al-itbaq'],
  },
  {
    slug: 'al-taakkul-al-sinni',
    term: 'تآكل الأسنان',
    termEn: 'Tooth Erosion / Wear',
    pillar: 'tasawwus-al-asnan',
    synonyms: ['تآكل المينا', 'بري الأسنان'],
    definition:
      'تآكل الأسنان هو فقدان تدريجي لبنية السن، يحدث بفعل الأحماض (من المشروبات الحمضية أو الارتجاع المعدي)، أو الاحتكاك الميكانيكي (كالتفريش العنيف أو صرير الأسنان). يختلف عن التسوّس لأنه لا تسبّبه البكتيريا مباشرة. يظهر كقِصَر أو شفافية أو حساسية في الأسنان. يُدار بمعالجة السبب وحماية المينا، وقد يحتاج ترميماً في الحالات المتقدّمة.',
    relatedArticles: ['khayarat-al-asnan-al-mutaakila', 'al-mashrubat-al-hamida-wa-bidayat-al-tasawwus'],
    relatedTerms: ['al-mina', 'sarir-al-asnan-mustalah', 'hassasiyat-al-asnan-mustalah'],
  },
  {
    slug: 'sarir-al-asnan-mustalah',
    term: 'صرير الأسنان',
    termEn: 'Bruxism',
    pillar: 'al-inaya-al-yawmiyya',
    synonyms: ['طحن الأسنان', 'جزّ الأسنان'],
    definition:
      'صرير الأسنان هو الجزّ على الأسنان أو طحنها لاوعيياً، غالباً أثناء النوم أو في فترات التوتّر. قد يسبّب تآكل الأسنان، وحساسية، وألم الفك والصداع، وتلف الترميمات. أسبابه تشمل التوتّر وسوء الإطباق وعوامل أخرى. يُدار غالباً بواقٍ ليلي يحمي الأسنان، ومعالجة السبب كالتوتّر. عند الأطفال يكون شائعاً وغالباً عابراً.',
    relatedArticles: ['ihtikak-asnan-al-tifl-al-amamiyya', 'al-inaya-bil-asnan-athna-al-imtihanat-wal-tawattur'],
    relatedTerms: ['al-taakkul-al-sinni', 'sou-al-itbaq', 'al-waqi-al-laili'],
  },
  {
    slug: 'al-waqi-al-laili',
    term: 'الواقي الليلي',
    termEn: 'Night Guard',
    pillar: 'al-inaya-al-yawmiyya',
    synonyms: ['حارس الليل', 'جبيرة الإطباق'],
    definition:
      'الواقي الليلي هو جهاز يُرتدى على الأسنان أثناء النوم لحماية الأسنان من أضرار صرير الأسنان، بتوزيع قوى الضغط ومنع احتكاك الأسنان ببعضها. يُوصف لمن يعانون من الجزّ أو الطحن الليلي، ويحمي الأسنان والترميمات من التآكل والكسر، وقد يخفّف ألم الفك. يُفصّل غالباً لدى الطبيب ليناسب الفم، ويحتاج تنظيفاً يومياً.',
    relatedArticles: ['al-inaya-bil-asnan-athna-al-imtihanat-wal-tawattur'],
    relatedTerms: ['sarir-al-asnan-mustalah', 'al-taakkul-al-sinni', 'mafsil-al-fak-mustalah'],
  },
  {
    slug: 'mafsil-al-fak-mustalah',
    term: 'مفصل الفكّ الصدغي',
    termEn: 'Temporomandibular Joint (TMJ)',
    pillar: 'taqwim-al-asnan',
    synonyms: ['المفصل الفكّي الصدغي', 'مفصل الفك'],
    definition:
      'مفصل الفكّ الصدغي هو المفصل الذي يربط الفكّ السفلي بالجمجمة ويتيح حركة الفم للمضغ والكلام. اضطراباته قد تسبّب ألماً في الفك، وطقطقة، وصعوبة في فتح الفم أو إغلاقه، وصداعاً. أسبابها متعددة منها صرير الأسنان والإجهاد وسوء الإطباق والإصابات. تُقيّم وتُعالَج حسب السبب، وقد يلعب الإطباق والتقويم دوراً في بعض الحالات.',
    relatedArticles: ['al-taqwim-wa-mushkilat-al-fak-tmj'],
    relatedTerms: ['sarir-al-asnan-mustalah', 'al-waqi-al-laili', 'sou-al-itbaq'],
  },
  {
    slug: 'al-asab-al-sinni',
    term: 'عصب السن',
    termEn: 'Tooth Nerve',
    pillar: 'tasawwus-al-asnan',
    synonyms: ['العصب السنّي'],
    definition:
      'عصب السن هو الجزء الحسّي ضمن لبّ السن، ويمنح السن إحساسه بالحرارة والبرودة والألم. عندما يصل التسوّس أو الكسر أو العدوى إلى العصب، قد يلتهب ويسبّب ألماً شديداً، ويحتاج عندها علاج العصب لإزالته وتنظيف القناة، أو خلع السن. ألم العصب غالباً علامة على مشكلة متقدّمة تستدعي علاجاً سريعاً.',
    relatedArticles: ['ilaj-al-asab', 'alam-al-asnan-min-al-tasawwus'],
    relatedTerms: ['lubb-al-sin', 'ilaj-al-asab-lubb-al-sin', 'al-khurraj-al-sinni'],
  },
  {
    slug: 'al-asnan-al-daima-mustalah',
    term: 'الأسنان الدائمة',
    termEn: 'Permanent Teeth',
    pillar: 'asnan-al-atfal',
    synonyms: ['الأسنان الثابتة'],
    definition:
      'الأسنان الدائمة هي المجموعة الثانية من الأسنان التي تحلّ محلّ الأسنان اللبنية، وعددها عادة 32 سناً (تشمل ضروس العقل). تبدأ بالبزوغ حوالي سنّ السادسة وتستمرّ حتى مرحلة المراهقة، وضروس العقل لاحقاً. وهي الأسنان التي ترافق الإنسان بقية حياته، لذا فإن العناية بها وبالأسنان اللبنية التي تحفظ مساحتها أساسية للحفاظ عليها مدى الحياة.',
    relatedArticles: ['al-asnan-al-daima-al-atfal-mata-tazhar', 'dirs-al-sitt-sanawat'],
    relatedTerms: ['al-asnan-al-labaniyya', 'hafiz-al-masafa'],
  },
];

export function getGlossaryTerm(slug) {
  return GLOSSARY.find((t) => t.slug === slug) || null;
}

export function getGlossarySlugs() {
  return GLOSSARY.map((t) => t.slug);
}
