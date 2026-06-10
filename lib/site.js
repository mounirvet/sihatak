// Single source of truth for site-wide constants.
// Change the name/url here once and it propagates everywhere.

export const SITE = {
  name: 'أسنانك',
  nameEn: 'Asnanik',
  url: 'https://asnanik.com',
  description:
    'أسنانك مرجع تثقيفي مستقل وموثوق لصحة الأسنان والفم، يقدّم معلومات علمية دقيقة بلغة عربية واضحة لجمهور الخليج العربي، يراجعها أطباء أسنان مختصون.',
  tagline: 'معلومات موثوقة عن صحة أسنانك، يراجعها المختصون',
};

// The pillar topics — the backbone of the topic-cluster architecture.
export const PILLARS = [
  {
    slug: 'amrad-al-litha',
    title: 'أمراض اللثة',
    titleEn: 'Gum Disease',
    icon: '🦷',
    summary: 'كل ما تحتاج معرفته عن التهاب اللثة وأمراض دواعم السن وطرق الوقاية والعلاج.',
  },
  {
    slug: 'tasawwus-al-asnan',
    title: 'تسوّس الأسنان',
    titleEn: 'Tooth Decay',
    icon: '🛡️',
    summary: 'أسباب التسوّس ومراحله وكيفية الوقاية منه وعلاجه في الأطفال والبالغين.',
  },
  {
    slug: 'asnan-al-atfal',
    title: 'صحة أسنان الأطفال',
    titleEn: 'Children’s Dental Health',
    icon: '👶',
    summary: 'دليل الآباء للعناية بأسنان الأطفال من الرضاعة حتى المراهقة.',
  },
  {
    slug: 'tabyid-al-asnan',
    title: 'تبييض وتجميل الأسنان',
    titleEn: 'Whitening & Cosmetic',
    icon: '✨',
    summary: 'حقائق علمية عن تبييض الأسنان والإجراءات التجميلية ومدى أمانها.',
  },
  {
    slug: 'al-inaya-al-yawmiyya',
    title: 'العناية اليومية',
    titleEn: 'Daily Oral Care',
    icon: '🪥',
    summary: 'الطريقة الصحيحة لتنظيف الأسنان واستخدام الخيط واختيار المنتجات.',
  },
  {
    slug: 'ziraat-al-asnan',
    title: 'زراعة وتعويض الأسنان',
    titleEn: 'Implants & Restoration',
    icon: '⚙️',
    summary: 'خيارات تعويض الأسنان المفقودة من الزراعة إلى الجسور والأطقم.',
  },
  {
    slug: 'taqwim-al-asnan',
    title: 'تقويم الأسنان',
    titleEn: 'Orthodontics',
    icon: '😬',
    summary: 'كل ما تحتاج معرفته عن تقويم الأسنان: الأنواع والتكلفة والمدة، للأطفال والكبار.',
  },
  {
    slug: 'taghdiya-wa-sihhat-al-fam',
    title: 'التغذية وصحّة الفم',
    titleEn: 'Nutrition & Oral Health',
    icon: '🥗',
    summary: 'العلاقة بين ما نأكله وصحّة الأسنان واللثة: أطعمة تقوّي، وأخرى تضرّ، وعناصر غذائية أساسية.',
  },
];

export const NAV = [
  { label: 'المحاور', href: '/mahawir/' },
  { label: 'المقالات', href: '/maqalat/' },
  { label: 'الجديد', href: '/jadeed/' },
  { label: 'المصطلحات', href: '/mustalahat/' },
  { label: 'الأدوات', href: '/adawat/' },
  { label: 'من نحن', href: '/man-nahnu/' },
];
