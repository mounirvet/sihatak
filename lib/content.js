import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import { addContextualLinks } from './autolink';

const articlesDir = path.join(process.cwd(), 'content', 'articles');

export function getArticleSlugs() {
  if (!fs.existsSync(articlesDir)) return [];
  return fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

export async function getArticle(slug) {
  const fullPath = path.join(articlesDir, `${slug}.md`);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  const processed = await remark().use(gfm).use(html, { sanitize: false }).process(content);
  // Inject contextual internal links into the body (never self-links).
  const contentHtml = addContextualLinks(processed.toString(), slug);
  return {
    slug,
    meta: data, // { title, answer, pillar, reviewer, date, updated, faq[], sources[], excerpt }
    contentHtml,
  };
}

export async function getAllArticles() {
  const slugs = getArticleSlugs();
  const articles = await Promise.all(slugs.map((s) => getArticle(s)));
  // Newest-added first: sort by `order` (higher = added more recently),
  // falling back to date. Articles without an `order` are treated as 0
  // (the original batch), so newer tagged articles surface on top.
  return articles.sort((a, b) => {
    const ao = a.meta.order || 0;
    const bo = b.meta.order || 0;
    if (bo !== ao) return bo - ao;
    return (b.meta.date || '').localeCompare(a.meta.date || '');
  });
}

export async function getArticlesByPillar(pillarSlug) {
  const all = await getAllArticles();
  return all.filter((a) => a.meta.pillar === pillarSlug);
}
