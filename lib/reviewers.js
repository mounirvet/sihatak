// Medical review board. EVERY article must be reviewed by a named, credentialed
// dentist — this is the single biggest trust signal for health (YMYL) content
// in both Google ranking and AI citation decisions.
//
// Replace these placeholders with REAL dentists you recruit. Each must have
// verifiable credentials. Authenticity is non-negotiable here.

export const REVIEWERS = {
  'dr-placeholder': {
    id: 'dr-placeholder',
    name: 'د. [اسم الطبيب]',
    nameEn: 'Dr. [Name]',
    credentials: 'أخصائي أمراض اللثة وزراعة الأسنان',
    bio: 'طبيب أسنان مرخّص بخبرة [X] سنوات في [الدولة]، متخصص في [التخصص].',
    license: 'رقم الترخيص: [—]',
  },
  // add more reviewers...
};

export function getReviewer(id) {
  return REVIEWERS[id] || REVIEWERS['dr-placeholder'];
}
