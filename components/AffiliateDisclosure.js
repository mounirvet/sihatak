// Affiliate disclosure — shown on every /adawat/ page. Required for trust + (in
// most jurisdictions) legally. Honest, plain-language, no hiding.
export default function AffiliateDisclosure() {
  return (
    <div className="bg-mint/40 border-r-4 border-teal rounded-lg p-4 text-sm text-ink/75 leading-relaxed mb-8">
      <strong className="text-ink">إفصاح:</strong> قد تحتوي هذه الصفحة على روابط لمنتجات
      من شركاء، وقد نحصل على عمولة عند الشراء عبرها دون أي تكلفة إضافية عليك. توصياتنا
      مبنية على معايير اختيار صحية موضّحة، ولا تؤثّر العمولة على رأينا. هذه الصفحة تثقيفية
      ولا تُغني عن استشارة طبيب الأسنان.{' '}
      <a href="/man-nahnu/al-ifsah/" className="text-teal hover:underline">اقرأ سياسة الإفصاح كاملة</a>.
    </div>
  );
}
