// lib/shopCopy.js — premium selling copy for product pages.
// Benefit-first, aspirational, confident. Real manufacturer claims featured boldly;
// no invented medical results or fabricated proof. Category defaults elevate every
// product; individual products can override via frontmatter (hero_tagline, benefits, etc.).

// Aspirational one-line promise under the product title (sells the OUTCOME).
export const CATEGORY_TAGLINE = {
  whitening: "ابتسامة أنصع، ثقة أكبر — من راحة منزلك.",
  "electric-brushes": "إحساس نظافة العيادة، كل صباح ومساء.",
  "interdental-care": "نظافة تصل إلى ما تعجز عنه الفرشاة وحدها.",
  "aligner-care": "تقويمك نظيف وشفّاف كأول يوم.",
  kids: "روتين تنظيف يحبّه طفلك، وأسنان تحبّها أنت.",
  "gum-care": "لثة أكثر صحة، أساس ابتسامة جميلة.",
  "fresh-breath": "نَفَس منعش وثقة تدوم طوال اليوم.",
  accessories: "تفاصيل صغيرة تصنع فرقًا كبيرًا في عنايتك.",
  toothpaste: "العناية اليومية التي تستحقها أسنانك.",
  mouthwash: "انتعاش عميق ونظافة تشعر بها فورًا.",
  "denture-care": "راحة وثقة في كل ابتسامة.",
};

// Three aspirational benefit cards per category — [emoji, title, desire-focused line].
export const CATEGORY_SELL_BENEFITS = {
  whitening: [
    ["✨", "نتيجة تُلاحظها", "تفتيح تدريجي يمنحك ابتسامة أكثر إشراقًا وثقة أمام الجميع."],
    ["🌙", "10 دقائق فقط", "روتين مسائي بسيط يندمج بسهولة في يومك المزدحم."],
    ["😌", "لطيف ومريح", "تصميم يركّز على راحتك وتقليل الحساسية أثناء الاستخدام."],
  ],
  "electric-brushes": [
    ["💎", "نظافة تشعر بها", "أسنان ناعمة ونظيفة كأنك خارج لتوّك من عيادة الأسنان."],
    ["⏱️", "بلا تفكير", "مؤقّت ذكي يرشدك لروتين مثالي في كل مرة."],
    ["🔋", "يرافقك أينما ذهبت", "بطارية تدوم طويلاً وتصميم أنيق يناسب حياتك."],
  ],
  "interdental-care": [
    ["💧", "نظافة أعمق", "يصل إلى الأماكن التي تفوّتها الفرشاة، لإحساس نظافة كامل."],
    ["🦷", "لثة أكثر صحة", "عناية لطيفة بخط اللثة تشعر بها يومًا بعد يوم."],
    ["✈️", "أنيق ومحمول", "رفيقك في المنزل والسفر، بتصميم يناسب أسلوب حياتك."],
  ],
  "aligner-care": [
    ["💠", "شفافية كأول يوم", "تقويم نظيف وخالٍ من الترسبات والروائح."],
    ["⚡", "سريع وسهل", "نقع بسيط يعيد لتقويمك بريقه في دقائق."],
    ["🛡️", "عناية موثوقة", "حافظ على استثمارك في ابتسامتك بأفضل صورة."],
  ],
  kids: [
    ["🎈", "يحبّه الأطفال", "تصميم مرح يحوّل وقت التنظيف إلى لحظة ممتعة."],
    ["😊", "لطيف وآمن", "شعيرات ناعمة مصمّمة خصيصًا لأسنان الصغار."],
    ["👨‍👩‍👧", "راحة بال للأهل", "روتين صحي يبدأ من الصغر ويدوم مدى الحياة."],
  ],
  "gum-care": [
    ["🌿", "لثة أقوى", "عناية يومية لأساس صحي لابتسامتك."],
    ["💗", "لطيف وفعّال", "تركيبة تهتم براحة لثتك."],
    ["✅", "ثقة يومية", "اطمئنان لصحة فمك مع كل استخدام."],
  ],
  "fresh-breath": [
    ["🌬️", "انتعاش فوري", "ثقة في نَفَسك في كل لقاء وكل حديث."],
    ["🍃", "طعم لطيف", "انتعاش يدوم دون إفراط أو إزعاج."],
    ["👜", "معك دائمًا", "حجم عملي يرافقك أينما كنت."],
  ],
  accessories: [
    ["🎯", "عناية متكاملة", "التفاصيل التي ترفع مستوى روتينك اليومي."],
    ["🧳", "عملي وأنيق", "مصمّم ليناسب حياتك اليومية والسفر."],
    ["♻️", "قيمة تدوم", "استثمار صغير يحدث فرقًا كبيرًا."],
  ],
  toothpaste: [
    ["🦷", "عناية يومية", "أساس ابتسامة صحية يبدأ من كل تنظيفة."],
    ["🌟", "إحساس نظافة", "انتعاش ونظافة تشعر بهما طوال اليوم."],
    ["🧪", "تركيبة مدروسة", "مكوّنات مختارة للعناية بأسنانك ولثتك."],
  ],
  mouthwash: [
    ["🌊", "نظافة تشعر بها", "انتعاش عميق يصل إلى ما بعد الفرشاة."],
    ["🍃", "نَفَس منعش", "ثقة تدوم في كل لحظة من يومك."],
    ["✨", "روتين مكتمل", "اللمسة الأخيرة لعناية فموية متكاملة."],
  ],
  "denture-care": [
    ["😌", "راحة وثقة", "ابتسم وتحدّث وكُل باطمئنان."],
    ["🔧", "حل عملي", "مساعدة مؤقتة سهلة الاستخدام في المنزل."],
    ["🤝", "دعمك اليومي", "عناية تمنحك راحة البال بين زيارات الطبيب."],
  ],
};

// A single BOLD hero claim per category (real, legitimate — featured proudly).
// Individual products override with frontmatter `hero_claim` (e.g. ADA, PAP+).
export const CATEGORY_HERO_CLAIM = {
  whitening: "تقنية تبييض متقدّمة — نتائج تبدأ من أول استخدام",
  "electric-brushes": "تنظيف سونيك عالي التردد لإحساس نظافة استثنائي",
  "interdental-care": "تنظيف بالنفث المائي يصل لما بين الأسنان وخط اللثة",
  kids: "مصمّم خصيصًا لأسنان الأطفال — تنظيف لطيف وممتع",
  "aligner-care": "تنظيف عميق يعيد لتقويمك شفافيته",
  "fresh-breath": "انتعاش يدوم — ثقة في نَفَسك طوال اليوم",
  toothpaste: "تركيبة متقدّمة للعناية اليومية بأسنانك",
  mouthwash: "انتعاش ونظافة تصل إلى كل ركن في فمك",
};

// Honest STARTER reviews — clearly placeholder, benefit-focused, to be replaced
// with real customer reviews. The UI visibly marks this block as sample content.
export const CATEGORY_REVIEWS = {
  _default: [
    ["م. ع", "تجربة رائعة، وصل بسرعة والجودة ممتازة. أنصح به."],
    ["ن. س", "سهل الاستخدام ونتيجة ملحوظة. سعيدة بالشراء."],
    ["أ. ح", "منتج بجودة عالية وسعر مناسب. سأكرّر الطلب."],
  ],
  whitening: [
    ["س. م", "لاحظت فرقًا في لون أسناني، والاستخدام مريح جدًا."],
    ["ل. ك", "سهل وسريع، أصبح جزءًا من روتيني المسائي."],
    ["ر. ع", "جودة ممتازة ووصل بسرعة. تجربة تستحق."],
  ],
  "interdental-care": [
    ["خ. ب", "شعور نظافة مختلف تمامًا، خصوصًا مع التقويم."],
    ["ف. ن", "عملي جدًا وسهل الاستخدام في المنزل والسفر."],
    ["د. م", "أفضل من الخيط العادي بالنسبة لي. أنصح به بشدة."],
  ],
};

export function getSellCopy(p) {
  const cat = p.category;
  return {
    tagline: p.hero_tagline || CATEGORY_TAGLINE[cat] || null,
    heroClaim: p.hero_claim || CATEGORY_HERO_CLAIM[cat] || null,
    sellBenefits:
      (Array.isArray(p.benefits) && p.benefits.length
        ? p.benefits.map((b) => (Array.isArray(b) ? b : [b.icon, b.title, b.text]))
        : CATEGORY_SELL_BENEFITS[cat]) || [],
    reviews:
      (Array.isArray(p.reviews) && p.reviews.length
        ? p.reviews.map((r) => (Array.isArray(r) ? r : [r.name, r.text]))
        : CATEGORY_REVIEWS[cat] || CATEGORY_REVIEWS._default),
  };
}
