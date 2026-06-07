import Link from 'next/link';
import { SITE, PILLARS } from '../../lib/site';
import { getAllArticles } from '../../lib/content';
import { PillarCard, ArticleCard } from '../../components/Cards';

export default async function HomePage() {
  const articles = await getAllArticles();
  const latest = articles.slice(0, 6);

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="grain bg-sand">
        <div className="max-w-6xl mx-auto px-5 py-20 md:py-28 text-center">
          <span className="inline-block bg-mint text-teal-dark text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            مرجع مستقل · يراجعه أطباء أسنان مختصون
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-ink leading-tight mb-6">
            صحة أسنانك تبدأ
            <br />
            بمعلومة <span className="text-teal">موثوقة</span>
          </h1>
          <p className="text-lg md:text-xl text-ink/70 max-w-2xl mx-auto leading-relaxed mb-8">
            {SITE.tagline}. محتوى علمي دقيق بالعربية، مصمَّم لجمهور الخليج العربي،
            بعيداً عن الإعلانات والمصالح التجارية.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/mahawir/" className="bg-teal text-cream px-7 py-3 rounded-full font-medium hover:bg-teal-dark transition-colors">
              تصفّح المحاور
            </Link>
            <Link href="/man-nahnu/" className="border border-teal text-teal px-7 py-3 rounded-full font-medium hover:bg-mint transition-colors">
              من نحن
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Pillars ===== */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <h2 className="text-3xl font-display text-ink mb-2">المحاور الرئيسية</h2>
        <p className="text-ink/60 mb-8">ابدأ من الموضوع الذي يهمّك</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <PillarCard key={p.slug} pillar={p} />
          ))}
        </div>
      </section>

      {/* ===== Latest articles ===== */}
      {latest.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 py-16">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-3xl font-display text-ink">أحدث المقالات</h2>
            <Link href="/maqalat/" className="text-teal text-sm hover:underline">عرض الكل ←</Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* ===== Trust strip ===== */}
      <section className="bg-teal text-cream">
        <div className="max-w-6xl mx-auto px-5 py-14 grid gap-8 md:grid-cols-3 text-center">
          <div>
            <div className="text-3xl font-display mb-2">مراجعة طبية</div>
            <p className="text-cream/70 text-sm">كل مقال يراجعه طبيب أسنان مرخّص قبل النشر.</p>
          </div>
          <div>
            <div className="text-3xl font-display mb-2">مصادر علمية</div>
            <p className="text-cream/70 text-sm">نعتمد على منظمة الصحة العالمية والأبحاث المحكّمة.</p>
          </div>
          <div>
            <div className="text-3xl font-display mb-2">مستقلّون</div>
            <p className="text-cream/70 text-sm">لا نبيع علاجات ولا نروّج لعيادة. هدفنا التثقيف فقط.</p>
          </div>
        </div>
      </section>
    </>
  );
}
