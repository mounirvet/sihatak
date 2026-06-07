// Medical review board. EVERY article must be reviewed by a named, credentialed
// dentist — this is the single biggest trust signal for health (YMYL) content
// in both Google ranking and AI citation decisions.
//
// Replace these placeholders with REAL dentists you recruit. Each must have
// verifiable credentials. Authenticity is non-negotiable here.

export const REVIEWERS = {
  'dr-placeholder': {
    id: 'dr-placeholder',
    name: 'د. رضا بغورة',
    nameEn: 'Dr. Rida Baghoura',
    credentials: 'طبيب أسنان عام',
    bio: 'طبيب أسنان عام خرّيج جامعة سطيف في الجزائر، يتمتّع بخبرة تتجاوز 15 عاماً في طب الأسنان. يراجع محتوى الموقع طبياً لضمان دقّته وموثوقيته.',
    license: '',
  },
  // add more reviewers...
};

export function getReviewer(id) {
  return REVIEWERS[id] || REVIEWERS['dr-placeholder'];
}