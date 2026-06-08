import Link from 'next/link';
import { PILLAR_ICONS, IconArrowL } from './Icons';

export function ArticleCard({ article }) {
  const { slug, meta } = article;
  return (
    <Link
      href={`/maqalat/${slug}/`}
      className="group flex flex-col bg-cream border border-line rounded-2xl p-6 shadow-card hover:shadow-soft hover:border-teal-light transition-all duration-200"
    >
      <h3 className="font-display text-lg text-ink group-hover:text-teal mb-2 leading-snug transition-colors">
        {meta.title}
      </h3>
      <p className="text-sm text-ink/55 leading-relaxed line-clamp-2 flex-1">
        {meta.excerpt || meta.answer}
      </p>
      <span className="inline-flex items-center gap-1.5 mt-4 text-xs text-coral font-medium">
        اقرأ المقال
        <IconArrowL className="w-3.5 h-3.5" />
      </span>
    </Link>
  );
}

export function PillarCard({ pillar }) {
  const Icon = PILLAR_ICONS[pillar.slug];
  return (
    <Link
      href={`/mahawir/${pillar.slug}/`}
      className="group block bg-cream border border-line rounded-2xl p-7 shadow-card hover:shadow-soft hover:-translate-y-1 hover:border-teal-light transition-all duration-200"
    >
      <div className="w-12 h-12 rounded-xl bg-mint flex items-center justify-center text-teal mb-4 group-hover:bg-teal group-hover:text-cream transition-colors duration-200">
        {Icon ? <Icon className="w-6 h-6" /> : null}
      </div>
      <h3 className="font-display text-xl text-ink group-hover:text-teal mb-2 transition-colors">{pillar.title}</h3>
      <p className="text-sm text-ink/55 leading-relaxed">{pillar.summary}</p>
    </Link>
  );
}
