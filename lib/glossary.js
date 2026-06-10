// Glossary / dictionary of dental terms (مصطلحات)
// Each term: slug, term (AR), termEn, pillar, definition, quickAnswer (TL;DR),
// alternateName (synonyms — feeds schema + search), pronunciation, relatedArticles, relatedTerms.

export const GLOSSARY = [
  {
    slug: 'iltihab-al-litha',
    term: 'التهاب اللثة',
    termEn: 'Gingivitis',
    pillar: 'amrad-al-litha',
    definition:
      'التهاب اللثة هو التهاب يصيب أنسجة اللثة المحيطة بالأسنان، وهو المرحلة الأولى والأكثر شيوعاً من أمراض اللثة. ينتج غالباً عن تراكم البلاك (طبقة البكتيريا اللزجة) عند خط اللثة، ويسبّب احمراراً وتورّماً ونزيفاً عند التنظيف. وهو قابل للعكس تماماً إذا عولج مبكراً بالنظافة الجيدة والتنظيف الاحترافي، لكن إهماله قد يتطوّر إلى التهاب دواعم السن.',
    quickAnswer: 
      'التهاب اللثة هو المرحلة الأولى من أمراض اللثة، يسبّب احمراراً ونزيفاً، وقابل للعكس بالعناية الجيّدة.',
    alternateName: ['التهاب اللّثة', 'اللثة الملتهبة'],
    pronunciation: 'iltihāb al-litha',
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
    quickAnswer: 
      'التهاب دواعم السن مرحلة متقدّمة من أمراض اللثة تصيب العظم الداعم وقد تؤدّي لفقدان الأسنان.',
    alternateName: ['التهاب دواعم الأسنان', 'أمراض دواعم السن'],
    pronunciation: 'iltihāb dawāʾim as-sin',
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
    quickAnswer: 
      'البلاك طبقة لزجة من البكتيريا تتكوّن على الأسنان باستمرار، وإزالتها بالتنظيف تمنع التسوّس وأمراض اللثة.',
    alternateName: ['اللويحة الجرثومية', 'الطبقة الجرثومية', 'البلاك السني'],
    pronunciation: 'al-balāk',
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
    quickAnswer: 
      'الجير بلاك متصلّب لا يُزال بالفرشاة، بل يحتاج تنظيفاً احترافياً عند طبيب الأسنان.',
    alternateName: ['القلح', 'الترسبات الجيرية', 'تكلّس الأسنان'],
    pronunciation: 'al-jir',
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
    quickAnswer: 
      'تسوّس الأسنان تلف يصيب المينا بفعل أحماض البكتيريا، ويُوقَف بالفلورايد والتنظيف وتقليل السكّر.',
    alternateName: ['التسوس', 'سوس الأسنان', 'نخر الأسنان', 'الكاريس'],
    pronunciation: 'tasawwus al-asnān',
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
    quickAnswer: 
      'الفلورايد معدن يقوّي مينا الأسنان ويقاوم التسوّس، ويوجد في معاجين الأسنان والماء المفلور.',
    alternateName: ['الفلور', 'مادة الفلورايد'],
    pronunciation: 'al-flurāyd',
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
    quickAnswer: 
      'مينا الأسنان الطبقة الخارجية الصلبة التي تحمي السن، وهي أقسى نسيج في الجسم لكنها تتآكل بالأحماض.',
    alternateName: ['طبقة المينا', 'الميناء'],
    pronunciation: 'mīnā al-asnān',
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
    quickAnswer: 
      'انحسار اللثة تراجع نسيج اللثة وكشف جذر السن، ما قد يسبّب حساسية، وأسبابه تشمل التفريش العنيف وأمراض اللثة.',
    alternateName: ['تراجع اللثة', 'انكماش اللثة', 'تقلّص اللثة'],
    pronunciation: 'inḥisār al-litha',
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
    quickAnswer: 
      'تبييض الأسنان إجراء تجميلي يفتّح لون الأسنان، نتائجه تختلف وقد يسبّب حساسية مؤقتة ولا يبيّض الترميمات.',
    alternateName: ['تبيض الأسنان', 'تفتيح الأسنان'],
    pronunciation: 'tabyīḍ al-asnān',
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
    quickAnswer: 
      'الفينير قشور رقيقة تُلصق على واجهة الأسنان لتحسين شكلها ولونها، وهو إجراء تجميلي غالباً غير قابل للعكس.',
    alternateName: ['عدسات الأسنان', 'اللومينير'],
    pronunciation: 'al-fīnīr',
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
    quickAnswer: 
      'زراعة الأسنان تعويض للسن المفقود بجذر معدني (تيتانيوم) يُثبَّت في العظم ويُركَّب عليه تاج.',
    alternateName: ['زرع الأسنان', 'غرسة الأسنان', 'الزرعة السنية'],
    pronunciation: 'zirāʿat al-asnān',
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
    quickAnswer: 
      'الجسر السنّي تعويض ثابت يملأ فراغ سن مفقود بالاستناد على الأسنان المجاورة.',
    alternateName: ['جسر الأسنان', 'الكوبري'],
    pronunciation: 'al-jusūr as-sinniyya',
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
    quickAnswer: 
      'التسنين ظهور أسنان الطفل اللبنية، يبدأ غالباً نحو الشهر السادس وقد يسبّب انزعاجاً مؤقتاً.',
    alternateName: ['بزوغ الأسنان', 'طلوع الأسنان'],
    pronunciation: 'at-tasnīn',
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
    quickAnswer: 
      'الأسنان اللبنية أسنان الطفل المؤقتة، مهمّة للمضغ والكلام وحفظ مكان الأسنان الدائمة.',
    alternateName: ['أسنان الحليب', 'الأسنان المؤقتة'],
    pronunciation: 'al-asnān al-labaniyya',
    relatedArticles: ['al-asnan-al-labaniyya', 'dalil-al-inaya-bi-asnan-al-atfal'],
    relatedTerms: ['al-tasnin'],
  },
  {
    slug: 'al-hashwa-al-sinniyya',
    term: 'الحشوة السنّية',
    termEn: 'Dental Filling',
    pillar: 'tasawwus-al-asnan',
    definition:
      'الحشوة السنّية هي مادة تُستخدم لترميم سن متضرّر من التسوّس بعد إزالة الجزء المتسوّس، لإعادة شكله ووظيفته. تُصنع من موادّ مختلفة مثل الكومبوزيت بلون السن أو الأملغم، ويختار الطبيب النوع حسب موقع السن وحجم التسوّس. الحشوة توقف تقدّم التسوّس وتحمي السن، لكن السن المرمّم يبقى بحاجة لنظافة دقيقة عند حواف الحشوة.',
    quickAnswer: 
      'الحشوة السنّية مادة تُملأ بها فجوة التسوّس بعد تنظيفها لإعادة شكل السن ووظيفته.',
    alternateName: ['حشو الأسنان', 'حشوة السن'],
    pronunciation: 'al-ḥashwa as-sinniyya',
    relatedArticles: ['hashw-al-asnan-al-marahil-wal-anwa', 'al-tasawwus-hawl-al-hashwat-wal-tijan'],
    relatedTerms: ['tasawwus-al-asnan', 'al-taj-al-sinni'],
  },
  {
    slug: 'al-taj-al-sinni',
    term: 'التاج السنّي',
    termEn: 'Dental Crown',
    pillar: 'ziraat-al-asnan',
    definition:
      'التاج السنّي هو غطاء يُركّب على سن متضرّر بشدّة ليغلّفه بالكامل ويعيد شكله وقوته ومظهره. يُستخدم عند تضرّر السن بحيث لا تكفي الحشوة، أو بعد علاج العصب، أو لتغطية زرعة. يُصنع من موادّ كالخزف أو المعدن أو مزيج منهما. التاج يحمي السن ويستعيد وظيفته، لكن السن الطبيعي تحته واللثة حوله يحتاجان عناية مستمرّة.',
    quickAnswer: 
      'التاج السنّي غطاء يغلّف السن المتضرّر لاستعادة شكله وقوّته، يُستخدم بعد علاج العصب أو للكسور.',
    alternateName: ['تلبيسة الأسنان', 'الكراون'],
    pronunciation: 'at-tāj as-sinnī',
    relatedArticles: ['tijan-al-asnan', 'al-tasawwus-hawl-al-hashwat-wal-tijan'],
    relatedTerms: ['al-hashwa-al-sinniyya', 'ilaj-al-asab-lubb-al-sin', 'al-jusur-al-sinniyya'],
  },
  {
    slug: 'ilaj-al-asab-lubb-al-sin',
    term: 'علاج العصب (لبّ السن)',
    termEn: 'Root Canal Treatment',
    pillar: 'tasawwus-al-asnan',
    definition:
      'علاج العصب هو إجراء لإزالة لبّ السن الملتهب أو المصاب (العصب والأوعية داخل السن) وتنظيف قنوات الجذر وحشوها، لإنقاذ السن بدل خلعه. يُلجأ إليه عند وصول التسوّس أو العدوى أو الكسر إلى لبّ السن مسبّباً ألماً أو خراجاً. بعد العلاج، يُغطّى السن غالباً بتاج لحمايته. الإجراء يحفظ السن الطبيعي ويزيل مصدر الألم والعدوى.',
    quickAnswer: 
      'علاج العصب إزالة لبّ السن الملتهب وتنظيف القنوات وحشوها، لإنقاذ السن بدل خلعه.',
    alternateName: ['سحب العصب', 'معالجة الجذور', 'حشو العصب'],
    pronunciation: 'ʿilāj al-ʿaṣab',
    relatedArticles: ['ilaj-al-asab', 'khala-am-ilaj-asab'],
    relatedTerms: ['lubb-al-sin', 'al-khurraj-al-sinni', 'al-taj-al-sinni'],
  },
  {
    slug: 'lubb-al-sin',
    term: 'لبّ السن',
    termEn: 'Dental Pulp',
    pillar: 'tasawwus-al-asnan',
    definition:
      'لبّ السن هو النسيج الحيّ داخل السن، ويحتوي على الأعصاب والأوعية الدموية التي تغذّيه وتمنحه الإحساس. يقع في حجرة وسط السن وتمتدّ امتداداته في قنوات الجذور. عندما يصل التسوّس أو الكسر إلى اللبّ، قد يلتهب ويسبّب ألماً شديداً، ويحتاج عندها لعلاج العصب أو خلع السن. صحة اللبّ أساسية لبقاء السن حيّاً.',
    quickAnswer: 
      'لبّ السن النسيج الحيّ داخل السن الذي يحوي الأعصاب والأوعية الدموية.',
    alternateName: ['النسيج اللبّي'],
    pronunciation: 'lubb as-sin',
    relatedArticles: ['ilaj-al-asab'],
    relatedTerms: ['ilaj-al-asab-lubb-al-sin', 'al-asab-al-sinni', 'al-khurraj-al-sinni'],
  },
  {
    slug: 'al-khurraj-al-sinni',
    term: 'الخُراج السنّي',
    termEn: 'Dental Abscess',
    pillar: 'tasawwus-al-asnan',
    definition:
      'الخُراج السنّي هو تجمّع للصديد ناتج عن عدوى بكتيرية في السن أو اللثة أو العظم المحيط. يحدث غالباً نتيجة تسوّس عميق غير معالَج أو كسر يصل للبّ السن، ويسبّب ألماً شديداً وتورّماً وأحياناً حمّى. الخُراج حالة تستدعي علاجاً سريعاً لأنه قد ينتشر، ويُعالَج بتصريف العدوى وعلاج العصب أو خلع السن مع مضاد حيوي عند الحاجة.',
    quickAnswer: 
      'الخُراج السنّي تجمّع صديدي مؤلم ناتج عن عدوى بكتيرية في السن أو اللثة، يحتاج علاجاً سريعاً عند الطبيب.',
    alternateName: ['خراج الأسنان', 'الدمل السني', 'تجمّع صديدي'],
    pronunciation: 'al-khurrāj as-sinnī',
    relatedArticles: ['khurraj-al-asnan-tawari', 'khurraj-al-litha'],
    relatedTerms: ['lubb-al-sin', 'ilaj-al-asab-lubb-al-sin', 'tasawwus-al-asnan'],
  },
  {
    slug: 'hassasiyat-al-asnan-mustalah',
    term: 'حساسية الأسنان',
    termEn: 'Dentin Hypersensitivity',
    pillar: 'tasawwus-al-asnan',
    definition:
      'حساسية الأسنان هي ألم خاطف وقصير يحدث عند تعرّض الأسنان لمحفّزات كالبارد أو الساخن أو الحلو أو الحمضي. تنتج عادة عن انكشاف طبقة العاج تحت المينا، بسبب تآكل المينا أو انحسار اللثة أو تسوّس أو سن متصدّع. قد تكون عابرة أو علامة على مشكلة تحتاج علاجاً. تُدار بمعجون مخصّص وتفريش لطيف، مع تحديد السبب عند الطبيب.',
    quickAnswer: 
      'حساسية الأسنان ألم حادّ عابر عند تناول البارد أو الحارّ أو الحلو، سببه كشف العاج تحت المينا.',
    alternateName: ['تحسّس الأسنان', 'ألم الأسنان من البارد'],
    pronunciation: 'ḥassāsiyyat al-asnān',
    relatedArticles: ['hasasiyat-al-asnan', 'hasasiyat-al-asnan-al-mufajia-asbab'],
    relatedTerms: ['al-mina', 'al-aaj-al-sinni', 'inhisar-al-litha'],
  },
  {
    slug: 'al-aaj-al-sinni',
    term: 'العاج السنّي',
    termEn: 'Dentin',
    pillar: 'tasawwus-al-asnan',
    definition:
      'العاج هو الطبقة الموجودة تحت مينا الأسنان، وهو أليّن من المينا ويشكّل الجزء الأكبر من بنية السن. يحتوي على قنوات دقيقة تصل إلى لبّ السن، ولهذا فإن انكشافه (بتآكل المينا أو انحسار اللثة) يسبّب حساسية الأسنان. وبما أنه أقلّ صلابة من المينا، ينتشر فيه التسوّس أسرع عند وصوله إليه. حماية المينا تحمي العاج من الانكشاف.',
    quickAnswer: 
      'العاج السنّي الطبقة تحت المينا، أقلّ صلابة منها، وكشفه يسبّب حساسية الأسنان للبارد والحارّ.',
    alternateName: ['عاج الأسنان', 'طبقة العاج'],
    pronunciation: 'al-ʿāj as-sinnī',
    relatedArticles: ['hasasiyat-al-asnan'],
    relatedTerms: ['al-mina', 'hassasiyat-al-asnan-mustalah', 'lubb-al-sin'],
  },
  {
    slug: 'izalat-al-tamadun',
    term: 'إزالة التمعدن',
    termEn: 'Demineralization',
    pillar: 'tasawwus-al-asnan',
    definition:
      'إزالة التمعدن هي فقدان المعادن (كالكالسيوم والفوسفات) من مينا الأسنان بفعل الأحماض التي تنتجها بكتيريا البلاك من السكّر. وهي المرحلة الأولى من التسوّس، وتظهر غالباً كبقعة بيضاء قبل تشكّل التجويف. في هذه المرحلة، يكون الضرر قابلاً للعكس عبر إعادة التمعدن بالفلورايد وتحسين النظافة، قبل أن يتطوّر إلى تجويف يحتاج حشواً.',
    quickAnswer: 
      'إزالة التمعدن فقدان المينا لمعادنها بفعل الأحماض، وهي المرحلة الأولى قبل تكوّن التسوّس.',
    alternateName: ['فقدان المعادن', 'نزع التمعدن'],
    pronunciation: 'izālat at-tamaʿdun',
    relatedArticles: ['buqa-bayda-ala-al-asnan-bidayat-tasawwus', 'marahil-tasawwus-al-asnan-bil-tafsil'],
    relatedTerms: ['iadat-al-tamadun-mustalah', 'al-mina', 'tasawwus-al-asnan'],
  },
  {
    slug: 'iadat-al-tamadun-mustalah',
    term: 'إعادة التمعدن',
    termEn: 'Remineralization',
    pillar: 'tasawwus-al-asnan',
    definition:
      'إعادة التمعدن هي عملية استعادة المعادن المفقودة من مينا الأسنان، بمساعدة اللعاب والفلورايد. وهي الآلية الطبيعية التي يصلح بها الجسم الضرر المبكر للمينا (إزالة التمعدن) قبل تشكّل التجويف. الفلورايد يعزّز هذه العملية، ولهذا يمكن للبقع البيضاء المبكرة أن تُوقَف بل تتحسّن. إعادة التمعدن ممكنة قبل تشكّل التجويف فقط؛ بعده يلزم الترميم.',
    quickAnswer: 
      'إعادة التمعدن عودة المعادن إلى المينا بمساعدة اللعاب والفلورايد، ما قد يوقف التسوّس المبكر.',
    alternateName: ['إعادة بناء المينا', 'ترميم المينا'],
    pronunciation: 'iʿādat at-tamaʿdun',
    relatedArticles: ['iadat-al-tamadun-al-asnan', 'buqa-bayda-ala-al-asnan-bidayat-tasawwus'],
    relatedTerms: ['izalat-al-tamadun', 'al-fluraid', 'al-mina'],
  },
  {
    slug: 'sadd-al-shuqut-mustalah',
    term: 'سدّ الشقوق',
    termEn: 'Dental Sealant',
    pillar: 'asnan-al-atfal',
    definition:
      'سدّ الشقوق هو طبقة واقية رقيقة تُطبّق على الأسطح الماضغة للأضراس الخلفية لملء أخاديدها العميقة ومنع تراكم البكتيريا والطعام فيها. يُستخدم خاصة عند الأطفال للوقاية من تسوّس الأضراس، حيث يصعب تنظيف هذه الأخاديد بالفرشاة. الإجراء سريع وغير مؤلم، ويوفّر حماية إضافية فوق التنظيف اليومي والفلورايد.',
    quickAnswer: 
      'سدّ الشقوق طبقة واقية تُوضع على أسطح المضغ لحماية الأطفال من التسوّس في الأخاديد العميقة.',
    alternateName: ['السيلانت', 'المادة الساده', 'حشو وقائي'],
    pronunciation: 'sadd ash-shuqūq',
    relatedArticles: ['asnan-al-qirsh-al-atfal', 'al-himaya-min-tasawwus-al-atfal-yawmiyyan'],
    relatedTerms: ['al-fluraid', 'tasawwus-al-asnan'],
  },
  {
    slug: 'sou-al-itbaq',
    term: 'سوء الإطباق',
    termEn: 'Malocclusion',
    pillar: 'taqwim-al-asnan',
    definition:
      'سوء الإطباق هو عدم انتظام في اصطفاف الأسنان أو في طريقة التقاء الفكّين عند الإطباق. يشمل الازدحام، والفراغات، وبروز الأسنان، والعضّة العميقة أو المفتوحة أو المعكوسة. قد يؤثّر على المضغ والنطق وتنظيف الأسنان، ويزيد خطر التسوّس وأمراض اللثة وإجهاد الفك. يُعالَج غالباً بالتقويم، ويحدّد الأخصائي درجته والخطة المناسبة له.',
    quickAnswer: 
      'سوء الإطباق عدم انتظام إطباق الأسنان العلوية مع السفلية، وقد يحتاج تقويماً لتصحيحه.',
    alternateName: ['اعوجاج الأسنان', 'عدم انتظام الإطباق'],
    pronunciation: 'sūʾ al-iṭbāq',
    relatedArticles: ['tashih-al-asnan-al-bariza-wal-adda', 'ilaj-tazahum-al-asnan-wal-faraghat'],
    relatedTerms: ['taqwim-al-asnan-mustalah', 'al-mathbit-mustalah'],
  },
  {
    slug: 'taqwim-al-asnan-mustalah',
    term: 'تقويم الأسنان',
    termEn: 'Orthodontics / Braces',
    pillar: 'taqwim-al-asnan',
    definition:
      'تقويم الأسنان هو فرع وعلاج يهدف إلى تصحيح اصطفاف الأسنان والإطباق عبر تحريك الأسنان تدريجياً إلى مواضعها الصحيحة. يستخدم وسائل كالأقواس المعدنية أو الخزفية أو القوالب الشفافة. يعالج الازدحام والفراغات والبروز وسوء الإطباق، محسّناً المظهر والوظيفة وصحة الفم. مدّته تختلف حسب الحالة، ويتبعه ارتداء مثبّت للحفاظ على النتيجة.',
    quickAnswer: 
      'تقويم الأسنان علاج يصحّح اصطفاف الأسنان والإطباق باستخدام أجهزة ثابتة أو شفّافة.',
    alternateName: ['تقويم الأسنان', 'التقويم', 'الأسلاك'],
    pronunciation: 'taqwīm al-asnān',
    relatedArticles: ['ma-huwa-taqwim-al-asnan', 'anwa-taqwim-al-asnan'],
    relatedTerms: ['sou-al-itbaq', 'al-mathbit-mustalah', 'al-taqwim-al-shaffaf-mustalah'],
  },
  {
    slug: 'al-taqwim-al-shaffaf-mustalah',
    term: 'التقويم الشفاف',
    termEn: 'Clear Aligners',
    pillar: 'taqwim-al-asnan',
    definition:
      'التقويم الشفاف هو سلسلة من القوالب البلاستيكية الشفافة القابلة للإزالة، تُصمّم خصيصاً لتحريك الأسنان تدريجياً نحو اصطفاف أفضل. يُستبدل كل قالب بآخر كل فترة، ويُرتدى 20-22 ساعة يومياً ويُخلع للأكل والتنظيف. ميزته أنه شبه خفيّ ومريح، لكنه يعتمد على التزام المريض ويناسب الحالات البسيطة إلى المتوسطة غالباً.',
    quickAnswer: 
      'التقويم الشفاف قوالب بلاستيكية شفّافة قابلة للإزالة تصحّح اصطفاف الأسنان بشكل أقل وضوحاً من الأسلاك.',
    alternateName: ['التقويم اللامرئي', 'الإنفزلاين', 'القوالب الشفافة'],
    pronunciation: 'at-taqwīm ash-shaffāf',
    relatedArticles: ['al-taqwim-al-shaffaf-alainer', 'kam-saa-albas-al-alainer-yawmiyyan'],
    relatedTerms: ['taqwim-al-asnan-mustalah', 'al-mathbit-mustalah', 'sou-al-itbaq'],
  },
  {
    slug: 'al-mathbit-mustalah',
    term: 'المثبّت (الريتينر)',
    termEn: 'Retainer',
    pillar: 'taqwim-al-asnan',
    definition:
      'المثبّت هو جهاز يُرتدى بعد انتهاء التقويم للحفاظ على الأسنان في مواضعها الجديدة ومنعها من العودة لوضعها السابق. قد يكون متحرّكاً (شفافاً أو سلكياً) أو ثابتاً يُلصق خلف الأسنان. ارتداؤه كما يصف الطبيب ضروري، لأن إهماله قد يفقد نتيجة التقويم. المثبّت يحفظ استثمار شهور أو سنوات من العلاج.',
    quickAnswer: 
      'المثبّت جهاز يُلبس بعد التقويم للحفاظ على نتائجه ومنع عودة الأسنان لوضعها السابق.',
    alternateName: ['الريتينر', 'مثبّت التقويم'],
    pronunciation: 'al-mathbit',
    relatedArticles: ['al-mathbit-al-ritiner-baad-al-taqwim', 'al-inaya-bil-mathbit-al-shaffaf-ritiner'],
    relatedTerms: ['taqwim-al-asnan-mustalah', 'al-taqwim-al-shaffaf-mustalah'],
  },
  {
    slug: 'juyub-al-litha-mustalah',
    term: 'جيوب اللثة',
    termEn: 'Periodontal Pockets',
    pillar: 'amrad-al-litha',
    definition:
      'جيوب اللثة هي فراغات تتكوّن بين السن واللثة عندما تنفصل اللثة عن السن بسبب التهاب دواعم السن المتقدّم. كلما زاد عمق الجيب، دلّ ذلك على تطوّر المرض وفقدان العظم الداعم. تتجمّع في هذه الجيوب البكتيريا ويصعب تنظيفها، ما يفاقم العدوى. يقيس الطبيب عمقها لتقييم صحة اللثة، وتُعالَج بالتنظيف العميق وأحياناً الجراحة.',
    quickAnswer: 
      'جيوب اللثة فراغات تتكوّن بين اللثة والسن في أمراض اللثة المتقدّمة، وتؤوي البكتيريا.',
    alternateName: ['الجيوب اللثوية', 'جيوب دواعم السن'],
    pronunciation: 'juyūb al-litha',
    relatedArticles: ['juyub-al-litha', 'al-tanzif-al-amiq-taqlih-kasht'],
    relatedTerms: ['iltihab-dawaim-al-sin', 'al-tanzif-al-amiq-mustalah', 'inhisar-al-litha'],
  },
  {
    slug: 'al-tanzif-al-amiq-mustalah',
    term: 'التنظيف العميق (التقليح والكشط)',
    termEn: 'Scaling and Root Planing',
    pillar: 'amrad-al-litha',
    definition:
      'التنظيف العميق هو إجراء غير جراحي لعلاج أمراض اللثة، يشمل إزالة الجير والبلاك من فوق وتحت خط اللثة (التقليح)، وتنعيم أسطح الجذور (الكشط) لمساعدة اللثة على الالتئام. يُستخدم عند تكوّن جيوب اللثة والتهاب دواعم السن، ويختلف عن التنظيف الاعتيادي بوصوله تحت اللثة. قد يحتاج جلسات وتخديراً موضعياً حسب الحالة.',
    quickAnswer: 
      'التنظيف العميق إجراء يزيل الجير والبكتيريا من تحت خط اللثة لعلاج أمراض اللثة، يشمل التقليح والكشط.',
    alternateName: ['التقليح والكشط', 'تنظيف الجذور', 'كشط الجذور'],
    pronunciation: 'at-tanẓīf al-ʿamīq',
    relatedArticles: ['al-tanzif-al-amiq-taqlih-kasht'],
    relatedTerms: ['juyub-al-litha-mustalah', 'iltihab-dawaim-al-sin', 'al-jir'],
  },
  {
    slug: 'nazif-al-litha-mustalah',
    term: 'نزيف اللثة',
    termEn: 'Gum Bleeding',
    pillar: 'amrad-al-litha',
    definition:
      'نزيف اللثة هو خروج دم من اللثة، غالباً عند التنظيف بالفرشاة أو الخيط، وهو ليس طبيعياً بل علامة شائعة على التهاب اللثة المبكر الناتج عن تراكم البلاك. اللثة السليمة لا تنزف عادة عند التنظيف اللطيف. النزيف غالباً قابل للعكس بتحسين النظافة، لكن استمراره أو حدوثه تلقائياً يستدعي تقييم الطبيب لاستبعاد أسباب أعمق.',
    quickAnswer: 
      'نزيف اللثة علامة شائعة على التهابها، غالباً بسبب تراكم البلاك، ويتحسّن بالتنظيف المنتظم.',
    alternateName: ['نزف اللثة', 'دم اللثة'],
    pronunciation: 'nazīf al-litha',
    relatedArticles: ['hal-nazif-al-litha-tabii-am-indhar', 'mata-yastadi-nazif-al-litha-ziyarat-al-tabib'],
    relatedTerms: ['iltihab-al-litha', 'al-balak', 'alamat-amrad-al-litha-mustalah'],
  },
  {
    slug: 'khat-al-litha',
    term: 'خط اللثة',
    termEn: 'Gumline',
    pillar: 'al-inaya-al-yawmiyya',
    definition:
      'خط اللثة هو الموضع الذي تلتقي فيه اللثة بالسن. وهو منطقة بالغة الأهمية لصحة الفم، لأن البلاك يتراكم عندها بكثرة ويسبّب التهاب اللثة إن لم يُزَل. التنظيف الفعّال يجب أن يستهدف خط اللثة تحديداً بفرشاة موجّهة بزاوية نحوه. إهمال هذه المنطقة هو سبب رئيسي لأمراض اللثة، بينما تنظيفها الجيّد أساس الوقاية.',
    quickAnswer: 
      'خط اللثة الحدّ الذي تلتقي فيه اللثة بالسن، وهو منطقة حسّاسة يتراكم عندها البلاك بسهولة.',
    alternateName: ['حدّ اللثة', 'خط التقاء اللثة'],
    pronunciation: 'khaṭ al-litha',
    relatedArticles: ['tiqniyat-tafrish-li-sihhat-al-litha', 'rutin-yawmi-li-litha-salima'],
    relatedTerms: ['al-balak', 'iltihab-al-litha', 'inhisar-al-litha'],
  },
  {
    slug: 'alamat-amrad-al-litha-mustalah',
    term: 'أعراض أمراض اللثة',
    termEn: 'Gum Disease Symptoms',
    pillar: 'amrad-al-litha',
    definition:
      'أعراض أمراض اللثة هي العلامات التي تدلّ على التهابها، وتشمل احمرار اللثة وتورّمها، ونزيفها عند التنظيف، وتغيّر لونها، ورائحة الفم المستمرّة، وانحسار اللثة، وفي المراحل المتقدّمة تخلخل الأسنان. كثير من هذه الأعراض المبكرة بلا ألم، ولهذا تُهمل. ملاحظتها مبكراً تتيح علاجاً قابلاً للعكس قبل تطوّر المرض.',
    quickAnswer: 
      'أعراض أمراض اللثة تشمل الاحمرار والتورّم والنزيف وانحسار اللثة ورائحة الفم، وتستدعي مراجعة الطبيب.',
    alternateName: ['علامات التهاب اللثة', 'مؤشرات أمراض اللثة'],
    pronunciation: 'ʿalāmāt amrāḍ al-litha',
    relatedArticles: ['alamat-mubakkira-li-amrad-al-litha', 'ma-huwa-iltihab-al-litha'],
    relatedTerms: ['iltihab-al-litha', 'nazif-al-litha-mustalah', 'inhisar-al-litha'],
  },
  {
    slug: 'khayt-al-asnan-mustalah',
    term: 'خيط الأسنان',
    termEn: 'Dental Floss',
    pillar: 'al-inaya-al-yawmiyya',
    definition:
      'خيط الأسنان هو خيط رفيع يُستخدم لتنظيف ما بين الأسنان وعند خط اللثة، حيث لا تصل فرشاة الأسنان. يزيل البلاك وبقايا الطعام من هذه المناطق التي تُعدّ من أكثر مواضع التسوّس والتهاب اللثة. يُنصح باستخدامه مرة يومياً على الأقل، ويفضّل قبل النوم. الخيط جزء أساسي من النظافة اليومية لا إجراء كمالي.',
    quickAnswer: 
      'خيط الأسنان أداة لتنظيف ما بين الأسنان حيث لا تصل الفرشاة، وهو أساسي للوقاية من التسوّس وأمراض اللثة.',
    alternateName: ['الخيط السني', 'خيط تنظيف الأسنان'],
    pronunciation: 'khayṭ al-asnān',
    relatedArticles: ['kayfa-astakhdim-khayt-al-asnan', 'al-khayt-wa-sihhat-al-litha'],
    relatedTerms: ['al-balak', 'khat-al-litha', 'iltihab-al-litha'],
  },
  {
    slug: 'jafaf-al-fam-mustalah',
    term: 'جفاف الفم',
    termEn: 'Xerostomia / Dry Mouth',
    pillar: 'al-inaya-al-yawmiyya',
    definition:
      'جفاف الفم هو نقص في إفراز اللعاب يجعل الفم جافاً، وهو ليس مجرّد إزعاج بل عامل خطر لصحة الفم. فاللعاب يحمي الأسنان بغسل البقايا ومعادلة الأحماض وإعادة بناء المينا، لذا قلّته ترفع خطر التسوّس وأمراض اللثة. أسبابه تشمل بعض الأدوية، والجفاف، وحالات طبية. يُدار بالترطيب وتحفيز اللعاب ومعالجة السبب.',
    quickAnswer: 
      'جفاف الفم نقص اللعاب الذي يرفع خطر التسوّس وأمراض اللثة، وله أسباب متعددة منها بعض الأدوية.',
    alternateName: ['نقص اللعاب', 'الفم الجاف'],
    pronunciation: 'jafāf al-fam',
    relatedArticles: ['jafaf-al-fam', 'al-luaab-wa-himayat-al-asnan-min-al-tasawwus'],
    relatedTerms: ['al-luaab-mustalah', 'tasawwus-al-asnan', 'iltihab-al-litha'],
  },
  {
    slug: 'al-luaab-mustalah',
    term: 'اللعاب',
    termEn: 'Saliva',
    pillar: 'al-inaya-al-yawmiyya',
    definition:
      'اللعاب هو السائل الذي تفرزه الغدد اللعابية في الفم، ويؤدّي دوراً وقائياً أساسياً لصحة الأسنان. فهو يغسل بقايا الطعام والبكتيريا، ويعادل الأحماض التي تهاجم المينا، ويزوّد الأسنان بالمعادن لإعادة بنائها. كما يساعد على المضغ والبلع والتذوّق. قلّة اللعاب (جفاف الفم) تضعف هذه الحماية وترفع خطر التسوّس وأمراض اللثة.',
    quickAnswer: 
      'اللعاب سائل الفم الطبيعي الذي يعادل الأحماض ويغسل البقايا ويساعد على إعادة تمعدن المينا.',
    alternateName: ['الريق', 'إفراز الفم'],
    pronunciation: 'al-luʿāb',
    relatedArticles: ['al-luaab-wa-himayat-al-asnan-min-al-tasawwus', 'jafaf-al-fam'],
    relatedTerms: ['jafaf-al-fam-mustalah', 'iadat-al-tamadun-mustalah', 'al-mina'],
  },
  {
    slug: 'rayihat-al-fam-mustalah',
    term: 'رائحة الفم الكريهة',
    termEn: 'Halitosis / Bad Breath',
    pillar: 'al-inaya-al-yawmiyya',
    definition:
      'رائحة الفم الكريهة (البخر) هي رائحة غير مستحبّة تخرج من الفم، وغالباً ما تنتج عن تراكم البكتيريا على اللسان والأسنان، أو أمراض اللثة، أو جفاف الفم، أو بقايا الطعام. قد ترتبط أيضاً بأسباب خارج الفم. تُعالَج عادة بتحسين النظافة وتنظيف اللسان وعلاج سببها. استمرارها رغم النظافة الجيدة يستدعي تقييم الطبيب لتحديد السبب.',
    quickAnswer: 
      'رائحة الفم الكريهة مشكلة شائعة سببها غالباً البكتيريا وبقايا الطعام، وتتحسّن بالنظافة الجيّدة.',
    alternateName: ['بخر الفم', 'النفس الكريه'],
    pronunciation: 'rāʾiḥat al-fam',
    relatedArticles: ['rayihat-al-fam-al-mustamirra-asbab', 'raihat-al-fam-wa-amrad-al-litha'],
    relatedTerms: ['al-balak', 'iltihab-al-litha', 'kasht-al-lisan-mustalah'],
  },
  {
    slug: 'kasht-al-lisan-mustalah',
    term: 'تنظيف اللسان',
    termEn: 'Tongue Cleaning',
    pillar: 'al-inaya-al-yawmiyya',
    definition:
      'تنظيف اللسان هو إزالة الطبقة من البكتيريا وبقايا الطعام التي تتراكم على سطح اللسان، باستخدام كاشطة اللسان أو الفرشاة. يساعد على تقليل رائحة الفم وتحسين النظافة العامة، لأن اللسان يأوي جزءاً كبيراً من بكتيريا الفم. يُعدّ خطوة مكمّلة للتفريش والخيط في الروتين اليومي، لا بديلاً عنهما.',
    quickAnswer: 
      'تنظيف اللسان إزالة البكتيريا والبقايا عن سطح اللسان، ما يساعد على تقليل رائحة الفم.',
    alternateName: ['تنظيف اللسان', 'كشط اللسان', 'مكشطة اللسان'],
    pronunciation: 'tanẓīf al-lisān',
    relatedArticles: ['al-inaya-bil-lisan', 'kasht-al-lisan'],
    relatedTerms: ['rayihat-al-fam-mustalah', 'al-balak'],
  },
  {
    slug: 'al-furshat-al-kahrabaiyya-mustalah',
    term: 'فرشاة الأسنان الكهربائية',
    termEn: 'Electric Toothbrush',
    pillar: 'al-inaya-al-yawmiyya',
    definition:
      'فرشاة الأسنان الكهربائية هي فرشاة تعتمد على حركة آلية (دورانية أو ذبذبية) لتنظيف الأسنان، وقد تساعد على إزالة البلاك بفعالية وتسهّل التنظيف لمن يجدون صعوبة في التقنية اليدوية أو حركة اليد. بعض أنواعها ينبّه عند الضغط الزائد الذي يضرّ اللثة. لكن الفرشاة اليدوية بتقنية صحيحة فعّالة أيضاً؛ فالتقنية والانتظام أهمّ من نوع الفرشاة.',
    quickAnswer: 
      'فرشاة الأسنان الكهربائية فرشاة بحركة آلية قد تسهّل إزالة البلاك، خاصة لمن يجد صعوبة في التقنية اليدوية.',
    alternateName: ['الفرشاة الكهربائية', 'فرشاة كهربائية'],
    pronunciation: 'al-furshāt al-kahrabāʾiyya',
    relatedArticles: ['al-furshat-al-yadawiyya-am-al-kahrabaiyya', 'al-furshat-al-kahrabaiyya-wa-sihhat-al-litha'],
    relatedTerms: ['al-balak', 'khat-al-litha'],
  },
  {
    slug: 'al-bakteria-al-famawiyya',
    term: 'بكتيريا الفم',
    termEn: 'Oral Bacteria',
    pillar: 'al-inaya-al-yawmiyya',
    definition:
      'بكتيريا الفم هي مجموعة الكائنات الدقيقة التي تعيش طبيعياً في الفم، وبعضها مفيد وبعضها قد يضرّ. عندما تتراكم بكتيريا معيّنة في البلاك وتتغذّى على السكّر، تنتج أحماضاً تسبّب التسوّس، أو تهيّج اللثة فتسبّب التهابها. الحفاظ على توازن صحّي لبكتيريا الفم عبر النظافة وتقليل السكّر أساس الوقاية من أمراض الفم.',
    quickAnswer: 
      'بكتيريا الفم كائنات دقيقة تعيش في الفم، بعضها مفيد وبعضها يسبّب التسوّس وأمراض اللثة عند تراكمه.',
    alternateName: ['جراثيم الفم', 'ميكروبات الفم'],
    pronunciation: 'al-baktīriyā al-famawiyya',
    relatedArticles: ['al-baktiria-wal-balak-wa-bidayat-amrad-al-litha', 'al-himaya-min-al-tasawwus-al-atfal-yawmiyyan'],
    relatedTerms: ['al-balak', 'tasawwus-al-asnan', 'iltihab-al-litha'],
  },
  {
    slug: 'al-rabt-al-tajmili-mustalah',
    term: 'الربط التجميلي (البوندينج)',
    termEn: 'Dental Bonding',
    pillar: 'tabyid-al-asnan',
    definition:
      'الربط التجميلي هو إجراء يضيف فيه الطبيب مادة بلون السن (كومبوزيت) ويشكّلها مباشرة على السن لإصلاح كسر بسيط أو فراغ صغير أو تصبّغ محدود أو تعديل الشكل. يُنجز غالباً في جلسة واحدة، وهو أقل تكلفة وأكثر محافظة من الفينير لأنه يتطلّب برداً أقل أو لا برد. لكنه أقل متانة ومقاومة للتصبّغ من الخزف، وأسهل إصلاحاً.',
    quickAnswer: 
      'الربط التجميلي إجراء يُضاف فيه راتنج بلون السن لإصلاح الكسور أو الفراغات أو تحسين الشكل.',
    alternateName: ['البوندينج', 'الحشو التجميلي'],
    pronunciation: 'ar-rabṭ at-tajmīlī',
    relatedArticles: ['al-finir-muqabil-al-bonding-ayyuhuma', 'islah-sin-amami-maksur-khayarat'],
    relatedTerms: ['al-finir', 'tabyid-al-asnan'],
  },
  {
    slug: 'al-finir-mustalah',
    term: 'الفينير (القشور الخزفية)',
    termEn: 'Veneers',
    pillar: 'tabyid-al-asnan',
    definition:
      'الفينير هو قشرة رقيقة، غالباً من الخزف، تُلصق على السطح الأمامي للسن لتحسين لونه وشكله وحجمه. يُستخدم لعلاج التصبّغ، والكسور البسيطة، والفراغات الصغيرة، وعدم انتظام الشكل. الفينير التقليدي يتطلّب برد طبقة من المينا فيُعدّ دائماً عملياً. يمنح نتيجة جمالية متينة ومقاومة للتصبّغ، لكنه يحتاج عناية ومتابعة كالأسنان الطبيعية.',
    quickAnswer: 
      'الفينير قشور رقيقة تُلصق على واجهة الأسنان لتحسين شكلها ولونها، وهو إجراء تجميلي غالباً غير قابل للعكس.',
    alternateName: ['القشور الخزفية', 'عدسات الأسنان', 'اللومينير'],
    pronunciation: 'al-fīnīr',
    relatedArticles: ['hal-al-finir-daim-am-qabil-lil-izala', 'al-inaya-bil-finir-ala-al-mada-al-tawil'],
    relatedTerms: ['al-rabt-al-tajmili-mustalah', 'tabyid-al-asnan', 'al-mina'],
  },
  {
    slug: 'al-tasabbugh-al-sinni',
    term: 'تصبّغ الأسنان',
    termEn: 'Tooth Discoloration / Staining',
    pillar: 'tabyid-al-asnan',
    definition:
      'تصبّغ الأسنان هو تغيّر لونها عن الطبيعي، وقد يكون سطحياً (من الطعام والمشروبات الملوّنة والتدخين) أو داخلياً (من العمر أو بعض الأدوية أو إصابة السن). التصبّغ السطحي يستجيب غالباً للتنظيف والتبييض، بينما الداخلي قد يحتاج حلولاً تجميلية كالفينير. تحديد نوع التصبّغ يحدّد العلاج المناسب، ويقيّمه طبيب الأسنان.',
    quickAnswer: 
      'تصبّغ الأسنان تغيّر لونها بفعل عوامل كالقهوة والتدخين أو أسباب داخلية، وبعضه يستجيب للتبييض وبعضه لا.',
    alternateName: ['تلوّن الأسنان', 'اصفرار الأسنان', 'بقع الأسنان'],
    pronunciation: 'at-taṣabbugh as-sinnī',
    relatedArticles: ['tabyid-al-asnan-lil-murahiqin'],
    relatedTerms: ['tabyid-al-asnan', 'al-finir', 'al-mina'],
  },
  {
    slug: 'taqm-al-asnan-mustalah',
    term: 'طقم الأسنان',
    termEn: 'Dentures',
    pillar: 'ziraat-al-asnan',
    definition:
      'طقم الأسنان هو تعويض متحرّك يعوّض الأسنان المفقودة، وقد يكون كاملاً (يعوّض كل أسنان الفك) أو جزئياً (يعوّض بعضها). يستعيد القدرة على المضغ والكلام والمظهر، ويُزال للتنظيف وأثناء النوم. يحتاج عناية يومية بتنظيفه وتنظيف الفم، وقد يتطلّب تعديلاً دورياً مع تغيّر اللثة والعظم. هو خيار تعويضي شائع خاصة عند فقدان عدّة أسنان.',
    quickAnswer: 
      'طقم الأسنان تعويض متحرّك للأسنان المفقودة، كامل أو جزئي، يمكن إزالته وتنظيفه.',
    alternateName: ['أطقم الأسنان', 'الأسنان الصناعية', 'طقم متحرّك'],
    pronunciation: 'ṭaqm al-asnān',
    relatedArticles: ['al-inaya-bi-taqm-al-asnan-al-mutaharrik'],
    relatedTerms: ['al-jusur-al-sinniyya', 'ziraat-al-asnan'],
  },
  {
    slug: 'khala-al-sin-mustalah',
    term: 'خلع السن',
    termEn: 'Tooth Extraction',
    pillar: 'tasawwus-al-asnan',
    definition:
      'خلع السن هو إزالة سن من تجويفه في عظم الفك، ويُلجأ إليه عند تعذّر إنقاذ السن بسبب تسوّس شديد أو كسر أو عدوى أو ازدحام يتطلّب مساحة للتقويم. بعد الخلع، تتكوّن جلطة دموية ضرورية للشفاء يجب حمايتها. قد يحتاج الفراغ لتعويض لاحق لمنع ميل الأسنان المجاورة. يتبع الخلع تعليمات عناية لضمان تعافٍ سليم.',
    quickAnswer: 
      'خلع السن إزالة سن لا يمكن إنقاذه، يجريها الطبيب عند الضرورة مع خيارات تعويضه لاحقاً.',
    alternateName: ['قلع السن', 'نزع السن', 'شلع الضرس'],
    pronunciation: 'khalʿ as-sin',
    relatedArticles: ['al-inaya-bil-asnan-baad-khala-al-sin'],
    relatedTerms: ['al-khurraj-al-sinni', 'al-jusur-al-sinniyya', 'ziraat-al-asnan'],
  },
  {
    slug: 'hafiz-al-masafa',
    term: 'حافظ المساحة',
    termEn: 'Space Maintainer',
    pillar: 'asnan-al-atfal',
    definition:
      'حافظ المساحة هو جهاز صغير يُركّب للطفل بعد فقدان سن لبني مبكراً، ليبقي المكان مفتوحاً للسن الدائم القادم ويمنع ميل الأسنان المجاورة نحو الفراغ. فقدان السن اللبني قبل أوانه قد يضيّق المساحة ويسبّب ازدحام الأسنان الدائمة. الحافظ يحفظ هذه المساحة حتى بزوغ السن الدائم. يحدّد طبيب أسنان الأطفال الحاجة إليه ونوعه.',
    quickAnswer: 
      'حافظ المساحة جهاز يحفظ مكان سن لبني مفقود مبكراً حتى يبزغ السن الدائم في موضعه الصحيح.',
    alternateName: ['حافظة المسافة', 'جهاز حفظ المكان'],
    pronunciation: 'ḥāfiẓ al-masāfa',
    relatedArticles: ['khala-sin-labani-lil-tifl-mata', 'faqdan-al-sin-al-labani-mubakkiran'],
    relatedTerms: ['al-asnan-al-labaniyya', 'sou-al-itbaq'],
  },
  {
    slug: 'al-taakkul-al-sinni',
    term: 'تآكل الأسنان',
    termEn: 'Tooth Erosion / Wear',
    pillar: 'tasawwus-al-asnan',
    definition:
      'تآكل الأسنان هو فقدان تدريجي لبنية السن، يحدث بفعل الأحماض (من المشروبات الحمضية أو الارتجاع المعدي)، أو الاحتكاك الميكانيكي (كالتفريش العنيف أو صرير الأسنان). يختلف عن التسوّس لأنه لا تسبّبه البكتيريا مباشرة. يظهر كقِصَر أو شفافية أو حساسية في الأسنان. يُدار بمعالجة السبب وحماية المينا، وقد يحتاج ترميماً في الحالات المتقدّمة.',
    quickAnswer: 
      'تآكل الأسنان فقدان نسيج السن بفعل الأحماض أو الاحتكاك، ويظهر كحساسية وشفافية عند الأطراف.',
    alternateName: ['تآكل المينا', 'تساقط طبقة الأسنان', 'تحات الأسنان'],
    pronunciation: 'at-taʾākkul as-sinnī',
    relatedArticles: ['khayarat-al-asnan-al-mutaakila', 'al-mashrubat-al-hamida-wa-bidayat-al-tasawwus'],
    relatedTerms: ['al-mina', 'sarir-al-asnan-mustalah', 'hassasiyat-al-asnan-mustalah'],
  },
  {
    slug: 'sarir-al-asnan-mustalah',
    term: 'صرير الأسنان',
    termEn: 'Bruxism',
    pillar: 'al-inaya-al-yawmiyya',
    definition:
      'صرير الأسنان هو الجزّ على الأسنان أو طحنها لاوعيياً، غالباً أثناء النوم أو في فترات التوتّر. قد يسبّب تآكل الأسنان، وحساسية، وألم الفك والصداع، وتلف الترميمات. أسبابه تشمل التوتّر وسوء الإطباق وعوامل أخرى. يُدار غالباً بواقٍ ليلي يحمي الأسنان، ومعالجة السبب كالتوتّر. عند الأطفال يكون شائعاً وغالباً عابراً.',
    quickAnswer: 
      'صرير الأسنان جزّ أو طحن الأسنان لا إرادياً (غالباً أثناء النوم)، قد يسبّب تآكلاً وألم فكّ.',
    alternateName: ['جز الأسنان', 'طحن الأسنان', 'الكزّ'],
    pronunciation: 'ṣarīr al-asnān',
    relatedArticles: ['ihtikak-asnan-al-tifl-al-amamiyya', 'al-inaya-bil-asnan-athna-al-imtihanat-wal-tawattur'],
    relatedTerms: ['al-taakkul-al-sinni', 'sou-al-itbaq', 'al-waqi-al-laili'],
  },
  {
    slug: 'al-waqi-al-laili',
    term: 'الواقي الليلي',
    termEn: 'Night Guard',
    pillar: 'al-inaya-al-yawmiyya',
    definition:
      'الواقي الليلي هو جهاز يُرتدى على الأسنان أثناء النوم لحماية الأسنان من أضرار صرير الأسنان، بتوزيع قوى الضغط ومنع احتكاك الأسنان ببعضها. يُوصف لمن يعانون من الجزّ أو الطحن الليلي، ويحمي الأسنان والترميمات من التآكل والكسر، وقد يخفّف ألم الفك. يُفصّل غالباً لدى الطبيب ليناسب الفم، ويحتاج تنظيفاً يومياً.',
    quickAnswer: 
      'الواقي الليلي جهاز يُلبس أثناء النوم لحماية الأسنان من أضرار صرير الأسنان، والأفضل المفصّل لدى الطبيب.',
    alternateName: ['واقي الأسنان الليلي', 'حارس الأسنان', 'نايت غارد'],
    pronunciation: 'al-wāqī al-laylī',
    relatedArticles: ['al-inaya-bil-asnan-athna-al-imtihanat-wal-tawattur'],
    relatedTerms: ['sarir-al-asnan-mustalah', 'al-taakkul-al-sinni', 'mafsil-al-fak-mustalah'],
  },
  {
    slug: 'mafsil-al-fak-mustalah',
    term: 'مفصل الفكّ الصدغي',
    termEn: 'Temporomandibular Joint (TMJ)',
    pillar: 'taqwim-al-asnan',
    definition:
      'مفصل الفكّ الصدغي هو المفصل الذي يربط الفكّ السفلي بالجمجمة ويتيح حركة الفم للمضغ والكلام. اضطراباته قد تسبّب ألماً في الفك، وطقطقة، وصعوبة في فتح الفم أو إغلاقه، وصداعاً. أسبابها متعددة منها صرير الأسنان والإجهاد وسوء الإطباق والإصابات. تُقيّم وتُعالَج حسب السبب، وقد يلعب الإطباق والتقويم دوراً في بعض الحالات.',
    quickAnswer: 
      'مفصل الفكّ الصدغي المفصل الذي يربط الفكّ بالجمجمة، ومشكلاته قد تسبّب ألماً وصعوبة في الفتح والإطباق.',
    alternateName: ['مفصل الفك', 'المفصل الصدغي الفكي', 'TMJ'],
    pronunciation: 'mafṣil al-fak',
    relatedArticles: ['al-taqwim-wa-mushkilat-al-fak-tmj'],
    relatedTerms: ['sarir-al-asnan-mustalah', 'al-waqi-al-laili', 'sou-al-itbaq'],
  },
  {
    slug: 'al-asab-al-sinni',
    term: 'عصب السن',
    termEn: 'Tooth Nerve',
    pillar: 'tasawwus-al-asnan',
    definition:
      'عصب السن هو الجزء الحسّي ضمن لبّ السن، ويمنح السن إحساسه بالحرارة والبرودة والألم. عندما يصل التسوّس أو الكسر أو العدوى إلى العصب، قد يلتهب ويسبّب ألماً شديداً، ويحتاج عندها علاج العصب لإزالته وتنظيف القناة، أو خلع السن. ألم العصب غالباً علامة على مشكلة متقدّمة تستدعي علاجاً سريعاً.',
    quickAnswer: 
      'عصب السن النسيج الحيّ داخل السن، والتهابه يسبّب ألماً شديداً وقد يحتاج علاج عصب.',
    alternateName: ['عصب الأسنان', 'لبّ السن'],
    pronunciation: 'al-ʿaṣab as-sinnī',
    relatedArticles: ['ilaj-al-asab', 'alam-al-asnan-min-al-tasawwus'],
    relatedTerms: ['lubb-al-sin', 'ilaj-al-asab-lubb-al-sin', 'al-khurraj-al-sinni'],
  },
  {
    slug: 'al-asnan-al-daima-mustalah',
    term: 'الأسنان الدائمة',
    termEn: 'Permanent Teeth',
    pillar: 'asnan-al-atfal',
    definition:
      'الأسنان الدائمة هي المجموعة الثانية من الأسنان التي تحلّ محلّ الأسنان اللبنية، وعددها عادة 32 سناً (تشمل ضروس العقل). تبدأ بالبزوغ حوالي سنّ السادسة وتستمرّ حتى مرحلة المراهقة، وضروس العقل لاحقاً. وهي الأسنان التي ترافق الإنسان بقية حياته، لذا فإن العناية بها وبالأسنان اللبنية التي تحفظ مساحتها أساسية للحفاظ عليها مدى الحياة.',
    quickAnswer: 
      'الأسنان الدائمة الأسنان البالغة التي تحلّ محلّ اللبنية، وعددها 32 وتبقى مدى الحياة بالعناية الجيّدة.',
    alternateName: ['الأسنان البالغة', 'الأسنان المستديمة'],
    pronunciation: 'al-asnān ad-dāʾima',
    relatedArticles: ['al-asnan-al-daima-al-atfal-mata-tazhar', 'dirs-al-sitt-sanawat'],
    relatedTerms: ['al-asnan-al-labaniyya', 'hafiz-al-masafa'],
  },
  {
    slug: 'alam-al-asnan-mustalah',
    term: 'ألم الأسنان',
    termEn: 'Toothache',
    pillar: 'tasawwus-al-asnan',
    definition:
      'ألم الأسنان هو وجع يصيب السن أو ما حوله، وهو ليس مرضاً بحدّ ذاته بل علامة على سبب كامن يحتاج تشخيصاً. أبرز أسبابه التسوّس العميق، والتهاب أو خراج العصب، وأمراض اللثة، وسن متصدّع، أو حساسية الأسنان. قد يتراوح من خفيف متقطّع إلى شديد نابض. الألم الشديد المصحوب بتورّم أو حمّى قد يشير إلى عدوى تستدعي رعاية عاجلة. تسكين الألم مؤقتاً لا يعالج السبب، لذا تبقى زيارة طبيب الأسنان ضرورية.',
    quickAnswer: 
      'ألم الأسنان عرض شائع لأسباب متعددة كالتسوّس أو العدوى، ويستدعي مراجعة الطبيب لتحديد السبب وعلاجه.',
    alternateName: ['وجع الأسنان', 'وجع الضرس', 'ألم الضرس'],
    pronunciation: 'alam al-asnān',
    relatedArticles: ['alam-al-asnan-al-asbab-wa-mata-yakun-tariyan', 'alam-al-asnan-min-al-tasawwus'],
    relatedTerms: ['tasawwus-al-asnan', 'al-khurraj-al-sinni', 'al-asab-al-sinni'],
  },
  {
    slug: 'al-miswak',
    term: 'المسواك',
    termEn: 'Miswak / Siwak',
    pillar: 'al-inaya-al-yawmiyya',
    definition:
      'المسواك هو عود تنظيف طبيعي يُؤخذ غالباً من شجرة الأراك، استُخدم تقليدياً لتنظيف الأسنان وله مكانة ثقافية ودينية في المنطقة. تشير دراسات إلى أنه قد يساعد على إزالة البلاك وتقليل بكتيريا الفم بفعل مركّبات طبيعية فيه. لكنه لا يصل بين الأسنان كالخيط ولا يوفّر الفلورايد، ويعتمد على التقنية الصحيحة لتجنّب إيذاء اللثة. يُفضّل استخدامه مكمّلاً للفرشاة والمعجون والخيط لا بديلاً كاملاً عنها.',
    quickAnswer: 
      'المسواك عود طبيعي من شجر الأراك يُستخدم لتنظيف الأسنان، وله جذور ثقافية ودينية في المنطقة.',
    alternateName: ['السواك', 'عود الأراك'],
    pronunciation: 'al-miswāk',
    relatedArticles: ['al-miswak-wa-sihhat-al-asnan'],
    relatedTerms: ['al-balak', 'khayt-al-asnan-mustalah', 'al-fluraid'],
  },
  {
    slug: 'al-khayt-al-mai',
    term: 'الخيط المائي',
    termEn: 'Water Flosser / Oral Irrigator',
    pillar: 'al-inaya-al-yawmiyya',
    definition:
      'الخيط المائي (النافث المائي) هو جهاز يدفع تياراً من الماء بين الأسنان وعند خط اللثة لإزالة بقايا الطعام والبلاك. يكون مفيداً خاصة لمن لديهم تقويم أو جسور أو تعويضات، أو من يجدون صعوبة في استخدام الخيط التقليدي. قد يكون مكمّلاً جيّداً، لكنه لا يحلّ تماماً محلّ الخيط أو الفرشاة في إزالة البلاك الملتصق. يحدّد طبيب الأسنان دوره المناسب في روتينك.',
    quickAnswer: 
      'الخيط المائي جهاز يدفع تياراً من الماء لتنظيف ما بين الأسنان، مفيد لأصحاب التقويم والجسور.',
    alternateName: ['جهاز الواتر جت', 'مضخّة الماء للأسنان'],
    pronunciation: 'al-khayṭ al-māʾī',
    relatedArticles: ['adawat-tanzif-ma-bayna-al-asnan-lil-litha'],
    relatedTerms: ['khayt-al-asnan-mustalah', 'al-balak', 'khat-al-litha'],
  },
];

export function getGlossarySlugs() {
  return GLOSSARY.map((g) => g.slug);
}
export function getGlossaryTerm(slug) {
  return GLOSSARY.find((g) => g.slug === slug) || null;
}
