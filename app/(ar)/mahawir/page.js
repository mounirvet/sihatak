import { PILLARS } from '../../../lib/site';
import { PillarCard } from '../../../components/Cards';

export const metadata = {
  title: 'المحاور الرئيسية',
  description: 'محاور صحة الأسنان والفم: أمراض اللثة، التسوّس، أسنان الأطفال، التبييض، العناية اليومية، والزراعة.',
};

export default function PillarsIndex() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-14">
      <h1 className="text-4xl font-display font-bold text-ink mb-2">المحاور الرئيسية</h1>
      <p className="text-ink/60 mb-10">ستة محاور تغطّي كل ما يتعلق بصحة أسنانك وفمك</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map((p) => (
          <PillarCard key={p.slug} pillar={p} />
        ))}
      </div>
    </div>
  );
}
