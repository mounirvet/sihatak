import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import { addContextualLinks } from './autolink';

const articlesDir = path.join(process.cwd(), 'content', 'articles');

// Build a stable, URL-safe id from an Arabic (or mixed) heading. Keeps Arabic
// letters and digits, turns spaces/punctuation into hyphens. Used for TOC
// jump-links and as the heading's anchor id.
function slugifyHeading(text, index) {
  const base = text
    .replace(/<[^>]+>/g, '') // strip any inline tags
    .replace(/[.,،:؛!؟"'(){}\[\]\-—…?]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
  return base ? `${base}-${index}` : `section-${index}`;
}

// Post-process the rendered HTML: give every <h2> an id, and collect the
// list of headings so the page can render a table of contents. Done at build
// time — no client JS, content stays in the static HTML (SEO/GEO-safe).
function addHeadingIdsAndToc(htmlContent) {
  const toc = [];
  let i = 0;
  const withIds = htmlContent.replace(/<h2>(.*?)<\/h2>/g, (m, inner) => {
    i += 1;
    const id = slugifyHeading(inner, i);
    const text = inner.replace(/<[^>]+>/g, '').trim();
    toc.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: withIds, toc };
}

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
  let contentHtml = addContextualLinks(processed.toString(), slug);
  // Add heading ids + extract a table of contents (build-time, static).
  const { html: withIds, toc } = addHeadingIdsAndToc(contentHtml);
  contentHtml = withIds;
  // Estimate reading time from the plain-text word count. Arabic readers average
  // ~180 wpm; we round up and clamp to a sensible minimum.
  const plain = `${data.answer || ''} ${content}`.replace(/<[^>]+>/g, ' ');
  const words = plain.split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(2, Math.round(words / 180));
  return {
    slug,
    meta: data, // { title, answer, pillar, reviewer, date, updated, faq[], sources[], excerpt }
    contentHtml,
    toc, // [{ id, text }] for the table of contents
    readingMinutes,
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
