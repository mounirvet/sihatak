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
    bio: 'د. رضا بغورة طبيب أسنان حاصل على الدكتوراه في طب الأسنان من جامعة الجزائر عام 2015، ومتخصّص في طب وجراحة الأسنان. يمارس المهنة منذ أكثر من 11 عاماً وهو مرخّص من وزارة الصحة الجزائرية. يراجع محتوى موقع «أسنانك» طبياً للتأكّد من دقّته وموثوقيته ومطابقته للمعرفة الطبية المعتمدة، حرصاً على تقديم معلومات صحية موثوقة للقارئ.',
    degree: 'دكتوراه في طب الأسنان',
    university: 'جامعة الجزائر',
    graduationYear: '2015',
    specialty: 'طب وجراحة الأسنان',
    specialtyEn: 'Dental Medicine and Surgery',
    license: 'مرخّص من وزارة الصحة الجزائرية',
    yearsExperience: '11',
    // Real professional photo, cropped to a 600x600 headshot.
    photo: '/team/redha-beghoura.jpg',
    // Verifiable professional profile (LinkedIn). More can be added as they
    // come online (medical registry, clinic page) — each one strengthens the
    // entity-verification signal for YMYL ranking and AI citation.
    sameAs: [
      'https://www.linkedin.com/in/redha-baghoura-205053425/',
    ],
    // The on-site entity page for this reviewer
    url: '/man-nahnu/al-fariq-al-tibbi/',
  },
};

export function getReviewer(id) {
  return REVIEWERS[id] || REVIEWERS['dr-placeholder'];
}
