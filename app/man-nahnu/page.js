import Link from 'next/link';
import { SITE } from '../../lib/site';

export const metadata = {
  title: 'من نحن',
  description: 'أسنانك منصة تثقيفية مستقلة لصحة الأسنان والفم في الخليج العربي، يراجع محتواها أطباء أسنان مختصون.',
};

export default function AboutPage() {
  return (
    <div className="max-w-prose mx-auto px-5 py-14 prose-ar">
      <h1 className="text-4xl font-display font-bold text-ink mb-6">من نحن</h1>

      <p>
        <strong>{SITE.name}</strong> منصة تثقيفية مستقلة متخصصة في صحة الأسنان والفم،
        موجَّهة لجمهور الخليج العربي. هدفنا واحد: أن نوفّر معلومة طبية دقيقة وواضحة
        بالعربية، يسهل فهمها ويمكن الوثوق بها.
      </p>

      <h2>لماذا أنشأنا هذه المنصة؟</h2>
      <p>
        المحتوى العربي عن صحة الأسنان متوفّر بكثرة، لكن جودته متفاوتة ومصادره غالباً
        غير واضحة. أردنا أن نسدّ هذه الفجوة بمرجع عربي موثوق، يعتمد على العلم لا على
        الترويج التجاري.
      </p>

      <h2>كيف نضمن الدقة؟</h2>
      <ul>
        <li>كل مقال يكتبه متخصصون في المحتوى الصحي ثم <strong>يراجعه طبيب أسنان مرخّص</strong> قبل النشر.</li>
        <li>نعتمد على مصادر علمية موثوقة مثل منظمة الصحة العالمية والجمعيات الطبية المتخصصة والأبحاث المحكّمة.</li>
        <li>نراجع المقالات ونحدّثها دورياً لتبقى مواكبة لأحدث المعطيات.</li>
      </ul>

      <h2>استقلاليتنا</h2>
      <p>
        نحن منصة تثقيفية مستقلة. لا نبيع علاجات، ولا نروّج لعيادة أو منتج معيّن.
        محتوانا لا يُغني عن استشارة طبيب الأسنان، لكنه يساعدك على فهم وضعك واتخاذ
        قرارات أفضل لصحتك.
      </p>

      <div className="mt-10 flex gap-4 text-sm not-prose">
        <Link href="/man-nahnu/siyasat-al-tahrir/" className="text-teal hover:underline">سياسة التحرير والمراجعة الطبية ←</Link>
        <Link href="/man-nahnu/al-masadir/" className="text-teal hover:underline">مصادرنا العلمية ←</Link>
      </div>
    </div>
  );
}
