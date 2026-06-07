import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

// English content loader. Kept separate from the Arabic loader so the two
// languages never interfere. English articles live in content/en/articles/.
// Each English article's frontmatter has an `ar` field = the slug of its
// Arabic equivalent, used to emit hreflang links between the two versions.

const enArticlesDir = path.join(process.cwd(), 'content', 'en', 'articles');

export function getEnArticleSlugs() {
  if (!fs.existsSync(enArticlesDir)) return [];
  return fs
    .readdirSync(enArticlesDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

export async function getEnArticle(slug) {
  const fullPath = path.join(enArticlesDir, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  const processed = await remark().use(gfm).use(html, { sanitize: false }).process(content);
  return {
    slug,
    meta: data, // { title, answer, pillar, reviewer, date, updated, faq[], sources[], excerpt, ar }
    contentHtml: processed.toString(),
  };
}

export async function getAllEnArticles() {
  const slugs = getEnArticleSlugs();
  const articles = await Promise.all(slugs.map((s) => getEnArticle(s)));
  return articles
    .filter(Boolean)
    .sort((a, b) => {
      const ao = a.meta.order || 0;
      const bo = b.meta.order || 0;
      if (bo !== ao) return bo - ao;
      return (b.meta.date || '').localeCompare(a.meta.date || '');
    });
}
