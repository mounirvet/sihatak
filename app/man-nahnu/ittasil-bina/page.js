import { SITE } from '../../../lib/site';

export const metadata = {
  title: 'اتصل بنا',
  description: 'تواصل مع فريق «أسنانك» لأي استفسار أو ملاحظة حول المحتوى.',
  alternates: { canonical: '/man-nahnu/ittasil-bina/' },
};

function ContactSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'اتصل بنا — أسنانك',
    url: `${SITE.url}/man-nahnu/ittasil-bina/`,
    inLanguage: 'ar',
    isPartOf: { '@id': `${SITE.url}/#website` },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
      email: 'info@asnanik.com',
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default function ContactPage() {
  return (
    <div className="max-w-prose mx-auto px-5 py-14 prose-ar">
      <ContactSchema />
      <h1 className="text-4xl font-display font-bold text-ink mb-6">اتصل بنا</h1>

      <p>
        يسعدنا تواصلك معنا. سواء كان لديك سؤال حول محتوى الموقع، أو ملاحظة لتصحيح معلومة،
        أو اقتراح لموضوع جديد، أو استفسار يتعلّق بالخصوصية أو الشراكات — فريق «أسنانك»
        يرحّب برسالتك.
      </p>

      <h2>البريد الإلكتروني</h2>
      <p>
        راسلنا على:{' '}
        <a href="mailto:info@asnanik.com">info@asnanik.com</a>
      </p>
      <p>
        نسعى للردّ على الرسائل في أقرب وقت ممكن. يُرجى توضيح موضوع رسالتك بإيجاز ليصلك
        الردّ المناسب بسرعة.
      </p>

      <h2>تنبيه مهمّ</h2>
      <p>
        «أسنانك» منصّة تثقيفية ولا تقدّم استشارات طبية فردية عبر البريد. لتشخيص حالتك أو
        علاجها، يُرجى مراجعة طبيب أسنان مختصّ.
      </p>
    </div>
  );
}
