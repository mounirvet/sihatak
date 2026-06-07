import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-prose mx-auto px-5 py-28 text-center">
      <div className="text-6xl mb-4">🦷</div>
      <h1 className="text-3xl font-display font-bold text-ink mb-3">الصفحة غير موجودة</h1>
      <p className="text-ink/60 mb-8">يبدو أن هذه الصفحة غير متوفّرة. لنعد إلى البداية.</p>
      <Link href="/" className="bg-teal text-cream px-6 py-3 rounded-full font-medium hover:bg-teal-dark transition-colors">
        العودة للرئيسية
      </Link>
    </div>
  );
}
