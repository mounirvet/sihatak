// Single source of truth for site-wide constants.
// Change the name/url here once and it propagates everywhere.

export const SITE = {
  name: 'صحتك',
  nameEn: 'Sihatak',
  url: 'https://sihatak.example', // ← replace with real domain on deploy
  description:
    'صحتك مرجع تثقيفي مستقل وموثوق لصحة الأسنان والفم، يقدّم معلومات علمية دقيقة بلغة عربية واضحة لجمهور الخليج العربي، يراجعها أطباء أسنان مختصون.',
  tagline: 'معلومات موثوقة عن صحة أسنانك، يراجعها المختصون',
};

// The 6 pillar topics — the backbone of the topic-cluster architecture.
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
];

export const NAV = [
  { label: 'المحاور', href: '/mahawir/' },
  { label: 'المقالات', href: '/maqalat/' },
  { label: 'من نحن', href: '/man-nahnu/' },
];
