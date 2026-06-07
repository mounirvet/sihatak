export const metadata = {
  title: 'مصادرنا العلمية',
  description: 'الجهات والمصادر العلمية الموثوقة التي نعتمد عليها في إعداد محتوانا.',
};

export default function SourcesPage() {
  return (
    <div className="max-w-prose mx-auto px-5 py-14 prose-ar">
      <h1 className="text-4xl font-display font-bold text-ink mb-6">مصادرنا العلمية</h1>
      <p>نعتمد في إعداد محتوانا على مصادر علمية وطبية موثوقة، من أبرزها:</p>
      <ul>
        <li><strong>منظمة الصحة العالمية (WHO)</strong> — التوصيات العالمية لصحة الفم.</li>
        <li><strong>الأكاديمية الأمريكية لطب أسنان الأطفال (AAPD)</strong> — إرشادات صحة أسنان الأطفال.</li>
        <li><strong>الجمعية الأمريكية لطب الأسنان (ADA)</strong> — معايير العناية والعلاج.</li>
        <li><strong>الاتحاد العالمي لطب الأسنان (FDI)</strong>.</li>
        <li>الدراسات والمراجعات المنشورة في <strong>مجلات علمية محكّمة</strong>.</li>
      </ul>
      <p>
        نحرص على الاستشهاد بالمصدر في نهاية كل مقال، وعلى تحديث المعلومات عند صدور
        أدلة علمية جديدة.
      </p>
    </div>
  );
}
