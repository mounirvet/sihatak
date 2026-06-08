import Link from 'next/link';
import { IconTooth } from '../components/Icons';

export default function NotFound() {
  return (
    <div className="max-w-prose mx-auto px-5 py-28 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-mint text-teal flex items-center justify-center mb-5"><IconTooth className="w-8 h-8" /></div>
      <h1 className="text-3xl font-display font-bold text-ink mb-3">الصفحة غير موجودة</h1>
      <p className="text-ink/60 mb-8">يبدو أن هذه الصفحة غير متوفّرة. لنعد إلى البداية.</p>
      <Link href="/" className="bg-teal text-cream px-6 py-3 rounded-full font-medium hover:bg-teal-dark transition-colors">
        العودة للرئيسية
      </Link>
    </div>
  );
}
