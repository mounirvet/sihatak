import Link from 'next/link';

export function ArticleCard({ article }) {
  const { slug, meta } = article;
  return (
    <Link
      href={`/maqalat/${slug}/`}
      className="block bg-cream border border-line rounded-xl p-5 shadow-card hover:shadow-soft hover:border-teal-light transition-all group"
    >
      <h3 className="font-display text-lg text-ink group-hover:text-teal mb-2 leading-snug">
        {meta.title}
      </h3>
      <p className="text-sm text-ink/60 leading-relaxed line-clamp-2">
        {meta.excerpt || meta.answer}
      </p>
      <span className="inline-block mt-3 text-xs text-coral font-medium">اقرأ المقال ←</span>
    </Link>
  );
}

export function PillarCard({ pillar }) {
  return (
    <Link
      href={`/mahawir/${pillar.slug}/`}
      className="block bg-cream border border-line rounded-xl p-6 shadow-card hover:shadow-soft hover:-translate-y-0.5 transition-all group"
    >
      <div className="text-3xl mb-3">{pillar.icon}</div>
      <h3 className="font-display text-xl text-ink group-hover:text-teal mb-2">{pillar.title}</h3>
      <p className="text-sm text-ink/60 leading-relaxed">{pillar.summary}</p>
    </Link>
  );
}
