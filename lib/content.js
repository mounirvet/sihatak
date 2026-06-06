import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

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
  const processed = await remark().use(html, { sanitize: false }).process(content);
  return {
    slug,
    meta: data, // { title, answer, pillar, reviewer, date, updated, faq[], sources[], excerpt }
    contentHtml: processed.toString(),
  };
}

export async function getAllArticles() {
  const slugs = getArticleSlugs();
  const articles = await Promise.all(slugs.map((s) => getArticle(s)));
  // newest first
  return articles.sort((a, b) =>
    (b.meta.date || '').localeCompare(a.meta.date || '')
  );
}

export async function getArticlesByPillar(pillarSlug) {
  const all = await getAllArticles();
  return all.filter((a) => a.meta.pillar === pillarSlug);
}
