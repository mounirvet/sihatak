import Link from 'next/link';
import { SITE, PILLARS } from '../lib/site';
import { getAllArticles } from '../lib/content';
import { getAllInsights } from '../lib/insights';
import { PillarCard, ArticleCard } from '../components/Cards';
import { IconSearch, IconArrowL, IconCheck } from '../components/Icons';

export default async function HomePage() {
  const articles = await getAllArticles();
  const latest = articles.slice(0, 6);
  const insights = await getAllInsights().catch(() => []);
  const latestInsight = insights[0] || null;
  const articleCount = articles.length;

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="relative grain bg-sand overflow-hidden">
        {/* soft radial glow for depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 0%, rgba(14,92,99,0.10) 0%, rgba(247,243,236,0) 70%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-5 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
          <span className="inline-flex items-center gap-2 bg-cream border border-line text-teal-dark text-sm font-medium px-4 py-1.5 rounded-full mb-7 shadow-card">
            <span className="w-1.5 h-1.5 rounded-full bg-teal" aria-hidden="true" />
            مرجع مستقل · يراجعه طبيب أسنان مختصّ
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-ink leading-[1.15] mb-6">
            صحة أسنانك تبدأ
            <br />
            بمعلومة <span className="text-teal">موثوقة</span>
          </h1>
          <p className="text-lg md:text-xl text-ink/65 max-w-2xl mx-auto leading-relaxed mb-9">
            {SITE.tagline}. محتوى علمي دقيق بالعربية، مصمَّم لجمهور الخليج العربي،
            بعيداً عن الإعلانات والمصالح التجارية.
          </p>

          {/* Search entry — a real, inviting box that links to /bahth/ */}
          <Link
            href="/bahth/"
            className="group flex items-center gap-3 max-w-xl mx-auto bg-cream border border-line rounded-full pr-5 pl-2 py-2 shadow-card hover:shadow-soft hover:border-teal-light transition-all mb-5"
          >
            <IconSearch className="w-5 h-5 text-ink/40 group-hover:text-teal transition-colors" />
            <span className="flex-1 text-right text-ink/45 text-base">
              ابحث عن موضوع… نزيف اللثة، تبييض، تسوّس الأطفال
            </span>
            <span className="shrink-0 bg-teal text-cream text-sm font-medium px-5 py-2.5 rounded-full group-hover:bg-teal-dark transition-colors">
              بحث
            </span>
          </Link>

          <div className="flex gap-3 justify-center flex-wrap text-sm">
            <Link href="/mahawir/" className="inline-flex items-center gap-1.5 text-teal font-medium hover:text-teal-dark transition-colors">
              تصفّح المحاور <IconArrowL className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Stat band — real, honest numbers */}
        <div className="relative border-t border-line/70 bg-cream/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-5 py-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-display font-bold text-teal">{articleCount}+</div>
              <div className="text-xs md:text-sm text-ink/55 mt-1">مقال تثقيفي</div>
            </div>
            <div className="border-x border-line/70">
              <div className="text-2xl md:text-3xl font-display font-bold text-teal">{PILLARS.length}</div>
              <div className="text-xs md:text-sm text-ink/55 mt-1">محاور رئيسية</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-display font-bold text-teal">100%</div>
              <div className="text-xs md:text-sm text-ink/55 mt-1">مُراجَع طبياً</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Pillars ===== */}
      <section className="max-w-6xl mx-auto px-5 py-16 md:py-20">
        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl md:text-4xl font-display text-ink mb-3">المحاور الرئيسية</h2>
          <p className="text-ink/55 leading-relaxed">
            ابدأ من الموضوع الذي يهمّك. كل محور يجمع مقالات مترابطة تغطّيه من كل جوانبه.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <PillarCard key={p.slug} pillar={p} />
          ))}
        </div>
      </section>

      {/* ===== Latest articles ===== */}
      {latest.length > 0 && (
        <section className="bg-cream/40 border-y border-line/70">
          <div className="max-w-6xl mx-auto px-5 py-16 md:py-20">
            <div className="flex items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-display text-ink mb-3">أحدث المقالات</h2>
                <p className="text-ink/55">إضافاتنا الجديدة إلى المكتبة</p>
              </div>
              <Link href="/maqalat/" className="inline-flex items-center gap-1.5 text-teal text-sm font-medium hover:text-teal-dark transition-colors shrink-0">
                عرض الكل <IconArrowL className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Latest insight (news) teaser ===== */}
      {latestInsight && (
        <section className="max-w-6xl mx-auto px-5 py-16 md:py-20">
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center bg-ink rounded-3xl p-8 md:p-12 text-cream overflow-hidden relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{ background: 'radial-gradient(50% 80% at 90% 10%, rgba(14,92,99,0.6) 0%, rgba(11,32,39,0) 70%)' }}
            />
            <div className="relative">
              <span className="inline-block text-xs font-medium text-mint/90 bg-teal/30 rounded-full px-3 py-1 mb-4">
                الجديد في طب الأسنان
              </span>
              <h2 className="text-2xl md:text-3xl font-display mb-3 leading-snug text-cream">{latestInsight.meta.title}</h2>
              <p className="text-cream/70 leading-relaxed line-clamp-2 mb-5 max-w-xl">
                {latestInsight.meta.excerpt || ''}
              </p>
              <Link
                href={`/jadeed/${latestInsight.slug}/`}
                className="inline-flex items-center gap-1.5 bg-cream text-ink text-sm font-medium px-5 py-2.5 rounded-full hover:bg-mint transition-colors"
              >
                اقرأ التحديث <IconArrowL className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== Trust / why-us ===== */}
      <section className="bg-teal text-cream">
        <div className="max-w-6xl mx-auto px-5 py-16 md:py-20">
          <h2 className="text-3xl md:text-4xl font-display text-center mb-12">لماذا تثق بأسنانك؟</h2>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              ['مراجعة طبية', 'كل مقال يراجعه طبيب أسنان مرخّص (دكتوراه في طب الأسنان) قبل النشر، للتأكّد من دقّته الطبية.'],
              ['مصادر علمية موثوقة', 'نعتمد على منظمة الصحة العالمية والجمعية الأمريكية لطب الأسنان وهيئات صحية معتمدة، لا على آراء عابرة.'],
              ['مستقلّون تماماً', 'لا نبيع علاجات ولا نروّج لعيادة ولا نعرض إعلانات. هدفنا الوحيد هو تثقيفك.'],
            ].map(([title, body]) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-cream/15 flex items-center justify-center mb-5">
                  <IconCheck className="w-6 h-6 text-cream" />
                </div>
                <h3 className="text-xl font-display mb-3">{title}</h3>
                <p className="text-cream/70 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/man-nahnu/al-fariq-al-tibbi/"
              className="inline-flex items-center gap-1.5 bg-cream text-teal-dark text-sm font-medium px-6 py-3 rounded-full hover:bg-mint transition-colors"
            >
              تعرّف على الفريق الطبي <IconArrowL className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
