import Link from 'next/link';
import { getReviewer } from '../../../lib/reviewers';
import { SITE, PILLARS } from '../../../lib/site';

const reviewer = getReviewer('dr-placeholder');

export const metadata = {
  title: 'الفريق الطبي — المراجعة الطبية لمحتوى أسنانك',
  description: `يراجع محتوى «أسنانك» طبياً ${reviewer.name} (${reviewer.nameEn})، ${reviewer.credentials}، لضمان دقّته وموثوقيته.`,
  alternates: { canonical: '/man-nahnu/al-fariq-al-tibbi/' },
};

// Person + medical reviewer schema — machine-readable proof of who reviews
// our YMYL content. This is a primary E-E-A-T / trust signal.
function ReviewerSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE.url}${reviewer.url}#person`,
    name: reviewer.nameEn,
    alternateName: reviewer.name,
    url: `${SITE.url}${reviewer.url}`,
    jobTitle: reviewer.specialtyEn,
    medicalSpecialty: 'Dentistry',
    description: reviewer.bio,
    knowsAbout: [
      'Dentistry',
      'Oral Health',
      'Dental Surgery',
      'Gum Disease',
      'Tooth Decay',
      'Pediatric Dentistry',
      'Teeth Whitening',
      'Dental Implants',
      'Orthodontics',
      'طب الأسنان',
      'صحة الفم',
    ],
    knowsLanguage: ['ar', 'fr', 'en'],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: reviewer.university,
    },
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'degree',
      educationalLevel: 'Doctorate',
      name: reviewer.degree,
      ...(reviewer.university
        ? { recognizedBy: { '@type': 'CollegeOrUniversity', name: reviewer.university } }
        : {}),
    },
    // Ties the reviewer to the publication entity — strengthens the
    // author↔site relationship that engines use to attribute expertise.
    worksFor: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    ...(reviewer.sameAs && reviewer.sameAs.length ? { sameAs: reviewer.sameAs } : {}),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default function MedicalTeamPage() {
  const r = reviewer;
  const pillarCount = PILLARS.length;
  return (
    <div className="bg-sand">
      <ReviewerSchema />
      <div className="max-w-3xl mx-auto px-5 py-14">
        {/* Breadcrumb */}
        <nav className="text-sm text-ink/50 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-teal">الرئيسية</Link>
          <span>/</span>
          <Link href="/man-nahnu/" className="hover:text-teal">من نحن</Link>
          <span>/</span>
          <span className="text-ink/70">الفريق الطبي</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-ink mb-3">الفريق الطبي</h1>
        <p className="text-ink/65 leading-relaxed mb-8 max-w-2xl">
          نلتزم في «أسنانك» بأعلى معايير الدقّة الطبية. لذلك يراجع محتوانا طبيب أسنان مختصّ
          للتأكّد من صحّة المعلومات وموثوقيتها ومطابقتها للمعرفة الطبية المعتمدة قبل نشرها.
        </p>

        {/* Factual review-scope band — concrete, verifiable facts (no invented
            numbers) that both readers and AI engines can cite. */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          <div className="bg-cream border border-line rounded-xl p-4 text-center">
            <div className="text-2xl font-display text-teal-dark">100%</div>
            <div className="text-xs text-ink/55 mt-1">من المقالات مراجَعة طبياً</div>
          </div>
          <div className="bg-cream border border-line rounded-xl p-4 text-center">
            <div className="text-2xl font-display text-teal-dark">{pillarCount}</div>
            <div className="text-xs text-ink/55 mt-1">محاور رئيسية مغطّاة</div>
          </div>
          <div className="bg-cream border border-line rounded-xl p-4 text-center">
            <div className="text-2xl font-display text-teal-dark">+{r.yearsExperience}</div>
            <div className="text-xs text-ink/55 mt-1">عاماً من الخبرة</div>
          </div>
        </div>

        {/* Reviewer card */}
        <div className="bg-cream border border-line rounded-2xl p-6 md:p-8 shadow-card">
          <div className="flex items-start gap-5 flex-wrap">
            {/* Photo slot — falls back to a monogram badge until a real photo is added */}
            <div className="w-24 h-24 rounded-full bg-mint flex items-center justify-center text-teal-dark text-3xl font-display shrink-0 overflow-hidden">
              {r.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.photo} alt={r.name} className="w-full h-full object-cover" />
              ) : (
                <span aria-hidden="true">ر.ب</span>
              )}
            </div>
            <div className="flex-1 min-w-[220px]">
              <h2 className="text-2xl font-display text-ink mb-1">{r.name}</h2>
              <p className="text-teal-dark text-sm mb-1">{r.nameEn}</p>
              <p className="text-ink/70 text-sm mb-4">{r.credentials}</p>

              {/* Credentials at-a-glance — quotable, structured facts */}
              <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div>
                  <dt className="text-ink/45">التخصّص</dt>
                  <dd className="text-ink">{r.specialty}</dd>
                </div>
                <div>
                  <dt className="text-ink/45">الشهادة</dt>
                  <dd className="text-ink">{r.degree}</dd>
                </div>
                <div>
                  <dt className="text-ink/45">الجامعة</dt>
                  <dd className="text-ink">{r.university} ({r.graduationYear})</dd>
                </div>
                <div>
                  <dt className="text-ink/45">سنوات الخبرة</dt>
                  <dd className="text-ink">أكثر من {r.yearsExperience} عاماً</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-ink/45">الترخيص</dt>
                  <dd className="text-ink">{r.license}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6 pt-6 border-t border-line">
            <p className="text-ink/80 leading-relaxed">{r.bio}</p>
          </div>
        </div>

        {/* Areas of expertise — links the reviewer entity to our pillars,
            reinforcing the topical authority association for search + AI. */}
        <div className="mt-10">
          <h2 className="text-xl font-display text-ink mb-3">نطاق المراجعة الطبية</h2>
          <p className="text-ink/70 text-sm leading-relaxed mb-4">
            يراجع {r.name} محتوى «أسنانك» عبر محاوره الرئيسية، لضمان دقّة المعلومات في كل مجال:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {PILLARS.map((p) => (
              <Link
                key={p.slug}
                href={`/mahawir/${p.slug}/`}
                className="block bg-cream border border-line rounded-xl px-4 py-3 text-sm text-ink hover:border-teal-light hover:text-teal transition-colors"
              >
                {p.title}
              </Link>
            ))}
          </div>
        </div>

        {/* How review works */}
        <div className="mt-10">
          <h2 className="text-xl font-display text-ink mb-3">كيف نراجع المحتوى؟</h2>
          <ul className="space-y-2 text-ink/75 text-sm leading-relaxed list-disc pr-5">
            <li>يُكتب كل مقال اعتماداً على مصادر طبية موثوقة (منظمة الصحة العالمية، الجمعية الأمريكية لطب الأسنان، هيئة الخدمات الصحية الوطنية، ومراكز السيطرة على الأمراض).</li>
            <li>يُراجع المحتوى طبياً للتأكّد من دقّته ومطابقته للمعرفة الطبية المعتمدة.</li>
            <li>نُحدّث المقالات دورياً، ونعرض تاريخ آخر مراجعة طبية على كل مقال.</li>
            <li>محتوانا تثقيفي عام ولا يُغني عن استشارة طبيب الأسنان لحالتك الفردية.</li>
          </ul>
        </div>

        <div className="mt-10">
          <Link href="/man-nahnu/" className="text-teal text-sm hover:underline">← العودة إلى «من نحن»</Link>
        </div>
      </div>
    </div>
  );
}
