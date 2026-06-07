import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

// Loader for the "الجديد في طب الأسنان" (latest in dentistry) section.
// These are timely, news/insight-style posts — kept separate from the
// evergreen articles. Sorted strictly by date, newest first, because for
// this section recency is the whole point.

const insightsDir = path.join(process.cwd(), 'content', 'insights');

export function getInsightSlugs() {
  if (!fs.existsSync(insightsDir)) return [];
  return fs
    .readdirSync(insightsDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

export async function getInsight(slug) {
  const fullPath = path.join(insightsDir, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  const processed = await remark().use(gfm).use(html, { sanitize: false }).process(content);
  return {
    slug,
    meta: data, // { title, date, updated, excerpt, category, sources[] }
    contentHtml: processed.toString(),
  };
}

export async function getAllInsights() {
  const slugs = getInsightSlugs();
  const insights = await Promise.all(slugs.map((s) => getInsight(s)));
  return insights
    .filter(Boolean)
    .sort((a, b) => (b.meta.date || '').localeCompare(a.meta.date || ''));
}
