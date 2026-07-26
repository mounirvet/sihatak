// Medical review board. EVERY article is reviewed by a named, credentialed
// dentist — the single biggest trust signal for health (YMYL) content in both
// Google ranking and AI citation decisions.
//
// All facts below are real and verifiable. Authenticity is non-negotiable here.

export const REVIEWERS = {
  'dr-placeholder': {
    id: 'dr-placeholder',
    name: 'د. رضا بغورة',
    nameEn: 'Dr. Redha Beghoura',
    credentials: 'دكتوراه في طب الأسنان · طب وجراحة الأسنان',
    // Short, factual bio built only from verified details.
    bio: 'د. رضا بغورة طبيب أسنان تخرّج من جامعة وهران عام 2012، ومتخصّص في طب وجراحة الأسنان. بدأ ممارسة المهنة عام 2013، وعمل نحو خمس سنوات في القطاع الصحّي العمومي، ثم يمارس منذ ذلك الحين في عيادته الخاصة بمدينة برج بوعريريج (الحمادية). يتجاوز مجموع خبرته المهنية 13 عاماً، وهو مرخّص من وزارة الصحة الجزائرية. يراجع محتوى موقع «أسنانك» طبياً للتأكّد من دقّته وموثوقيته ومطابقته للمعرفة الطبية المعتمدة، حرصاً على تقديم معلومات صحية موثوقة للقارئ.',
    degree: 'دكتوراه في طب الأسنان',
    university: 'جامعة وهران',
    graduationYear: '2012',
    specialty: 'طب وجراحة الأسنان',
    specialtyEn: 'Dental Medicine and Surgery',
    // Official French professional title, as shown on his clinic signage.
    titleFr: 'Chirurgien Dentiste',
    license: 'مرخّص من وزارة الصحة الجزائرية',
    // Real practising clinic — powers a Dentist/MedicalClinic schema entity and
    // visible contact details on the team page. A verifiable physical practice
    // is one of the strongest E-E-A-T signals for a medical reviewer.
    clinic: {
      name: 'عيادة الدكتور بغورة رضا لطب وجراحة الأسنان',
      nameFr: 'Cabinet Dr. Beghoura Redha — Chirurgien Dentiste',
      phone: '0781 09 89 06',
      phoneIntl: '+213781098906',
      city: 'برج بوعريريج',
      district: 'الحمادية',
      country: 'الجزائر',
      countryCode: 'DZ',
      mapUrl: 'https://maps.app.goo.gl/EAyoEmepyXXgrLew8',
    },
    yearsExperience: '13',
    // Real professional photo, cropped to a 600x600 headshot.
    photo: '/team/redha-beghoura.jpg',
    // Verifiable professional profile (LinkedIn). More can be added as they
    // come online (medical registry, clinic page) — each one strengthens the
    // entity-verification signal for YMYL ranking and AI citation.
    sameAs: [
      'https://www.linkedin.com/in/redha-baghoura-205053425/',
      'https://maps.app.goo.gl/EAyoEmepyXXgrLew8',
    ],
    // The on-site entity page for this reviewer
    url: '/man-nahnu/al-fariq-al-tibbi/',
  },
};

export function getReviewer(id) {
  return REVIEWERS[id] || REVIEWERS['dr-placeholder'];
}
