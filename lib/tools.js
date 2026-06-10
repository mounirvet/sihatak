// Recommended tools / products (أدوات) — the COMMERCIAL layer.
//
// IMPORTANT — how to use this file:
// - Each category has an honest, brand-neutral "how to choose" guide (educational),
//   followed by specific product recommendations you stand behind (your direct deals).
// - REPLACE every product marked PLACEHOLDER with your real brand-deal data:
//   name, the affiliate/deal URL (`url`), a one-line honest reason (`why`), and
//   optionally a price note. DO NOT add fake reviews/ratings.
// - Affiliate disclosure shows automatically on every /adawat/ page.
// - To add a category: add an object below. `slug` becomes /adawat/<slug>/.
//
// Schema note: we expose products as a plain ItemList (honest list), NOT as
// Review/AggregateRating — fabricated ratings violate Google policy and trust.

export const TOOL_CATEGORIES = [
  {
    slug: 'furash-al-asnan-al-kahrabaiyya',
    title: 'فرشاة الأسنان الكهربائية',
    titleEn: 'Electric Toothbrushes',
    pillar: 'al-inaya-al-yawmiyya',
    intro:
      'الفرشاة الكهربائية قد تساعد على إزالة البلاك بفعالية وتسهّل التنظيف لمن يجدون صعوبة في التقنية اليدوية أو حركة اليد. لكن الفرشاة اليدوية بتقنية صحيحة فعّالة أيضاً؛ فالأهمّ هو التقنية والانتظام لا نوع الفرشاة.',
    // Honest buying criteria — this is the value that earns trust before any link.
    howToChoose: [
      'اختر شعيرات ناعمة لحماية اللثة والمينا.',
      'ميزة التنبيه عند الضغط الزائد مفيدة لمن يضغطون بقوة.',
      'المؤقّت يساعد على ضمان مدّة تنظيف كافية.',
      'رأس بحجم مناسب للوصول إلى الأسنان الخلفية.',
      'سهولة استبدال الرؤوس وتوفّرها محلياً.',
    ],
    relatedArticles: ['al-furshat-al-yadawiyya-am-al-kahrabaiyya', 'al-furshat-al-kahrabaiyya-wa-sihhat-al-litha'],
    relatedTerms: ['al-furshat-al-kahrabaiyya-mustalah', 'al-balak'],
    products: [
      {
        name: 'PLACEHOLDER — اسم المنتج الأول',
        why: 'PLACEHOLDER — سبب صادق قصير لِمَ توصي به (مثال: شعيرات ناعمة + مستشعر ضغط + سعر مناسب).',
        url: 'https://example.com/REPLACE-WITH-YOUR-DEAL-LINK',
        priceNote: '', // optional, e.g. 'فئة سعرية متوسطة'
      },
      {
        name: 'PLACEHOLDER — اسم المنتج الثاني',
        why: 'PLACEHOLDER — سبب صادق قصير.',
        url: 'https://example.com/REPLACE-WITH-YOUR-DEAL-LINK',
        priceNote: '',
      },
    ],
  },
  {
    slug: 'al-khayt-al-mai-wa-adawat-ma-bayna-al-asnan',
    title: 'الخيط المائي وأدوات ما بين الأسنان',
    titleEn: 'Water Flossers & Interdental Tools',
    pillar: 'al-inaya-al-yawmiyya',
    intro:
      'تنظيف ما بين الأسنان أساسي لصحة اللثة، حيث لا تصل الفرشاة. الخيط المائي والفرشاة بين الأسنان أدوات تكمّل الخيط التقليدي، وتفيد خاصة مع التقويم والجسور أو لمن يصعب عليهم الخيط. المهم التنظيف اليومي بأداة مناسبة.',
    howToChoose: [
      'الخيط المائي مفيد خاصة حول التقويم والتعويضات.',
      'الفرشاة بين الأسنان تناسب الفراغات الأكبر.',
      'اختر الحجم المناسب لفراغات أسنانك (يوضّحه الطبيب).',
      'لمن يصعب عليهم الخيط التقليدي، النافث المائي بديل عملي.',
    ],
    relatedArticles: ['adawat-tanzif-ma-bayna-al-asnan-lil-litha', 'kayfa-astakhdim-khayt-al-asnan'],
    relatedTerms: ['al-khayt-al-mai', 'khayt-al-asnan-mustalah'],
    products: [
      {
        name: 'PLACEHOLDER — خيط مائي موصى به',
        why: 'PLACEHOLDER — سبب صادق قصير.',
        url: 'https://example.com/REPLACE-WITH-YOUR-DEAL-LINK',
        priceNote: '',
      },
    ],
  },
  {
    slug: 'mustahdarat-tabyid-al-asnan',
    title: 'مستحضرات تبييض الأسنان',
    titleEn: 'Teeth Whitening Products',
    pillar: 'tabyid-al-asnan',
    intro:
      'تبييض الأسنان المنزلي قد يفتّح التصبّغات السطحية، لكن فعاليته تختلف وقد يسبّب حساسية مؤقتة، ولا يبيّض الحشوات والتركيبات. يُفضّل استشارة طبيب الأسنان قبل البدء، خاصة عند وجود حساسية أو مشاكل لثة.',
    howToChoose: [
      'ابدأ باستشارة طبيب الأسنان لتحديد سبب التصبّغ ومدى ملاءمة التبييض.',
      'المنتجات المعتمدة وفق التعليمات أكثر أماناً.',
      'انتبه لحساسية الأسنان المؤقتة، وتوقّف عند الألم.',
      'التبييض لا يفتّح الفينير أو الحشوات.',
    ],
    relatedArticles: ['tabyid-al-asnan-lil-murahiqin'],
    relatedTerms: ['tabyid-al-asnan', 'al-tasabbugh-al-sinni', 'al-mina'],
    products: [
      {
        name: 'PLACEHOLDER — منتج تبييض موصى به',
        why: 'PLACEHOLDER — سبب صادق قصير، مع تنبيه استشارة الطبيب.',
        url: 'https://example.com/REPLACE-WITH-YOUR-DEAL-LINK',
        priceNote: '',
      },
    ],
  },
  {
    slug: 'adawat-al-inaya-bi-asnan-al-atfal',
    title: 'أدوات العناية بأسنان الأطفال',
    titleEn: 'Children’s Dental Care Products',
    pillar: 'asnan-al-atfal',
    intro:
      'العناية بأسنان الأطفال تبدأ من ظهور أول سن. اختيار أدوات مناسبة للعمر (فرشاة، معجون بكمية مناسبة) يساعد على بناء عادة صحية مبكرة. استشر طبيب أسنان الأطفال حول كمية الفلورايد المناسبة لعمر طفلك.',
    howToChoose: [
      'فرشاة بحجم مناسب لعمر الطفل وشعيرات ناعمة.',
      'كمية معجون الفلورايد تُحدّد حسب العمر (يوضّحها الطبيب).',
      'عضّاضات تسنين آمنة للرضّع.',
      'تصاميم محبّبة تشجّع الطفل على التنظيف.',
    ],
    relatedArticles: ['al-asnan-al-labaniyya'],
    relatedTerms: ['al-asnan-al-labaniyya', 'al-fluraid', 'al-tasnin'],
    products: [
      {
        name: 'PLACEHOLDER — منتج أطفال موصى به',
        why: 'PLACEHOLDER — سبب صادق قصير.',
        url: 'https://example.com/REPLACE-WITH-YOUR-DEAL-LINK',
        priceNote: '',
      },
    ],
  },
];

export function getToolCategory(slug) {
  return TOOL_CATEGORIES.find((c) => c.slug === slug) || null;
}
export function getToolSlugs() {
  return TOOL_CATEGORIES.map((c) => c.slug);
}
