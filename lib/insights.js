import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remarkParse from 'remark-parse';
import gfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import { addContextualLinks } from './autolink';

// Loader for the "الجديد في طب الأسنان" (latest in dentistry) section.
// These are timely, insight/research-style posts — kept in their own section
// from the evergreen articles, but now rendered to the SAME full standard
// (answer block, TOC, reading time, FAQ, contextual links) and woven into the
// site-wide internal-linking graph so they're no longer orphaned hubs.

const insightsDir = path.join(process.cwd(), 'content', 'insights');

// Sanitize schema: permits the HTML our Markdown legitimately produces (GFM
// tables, strong/em, links, headings, lists) while stripping anything dangerous
// (<script>, inline event handlers, javascript: URLs). Defense-in-depth.
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  attributes: {
    ...defaultSchema.attributes,
    th: [...(defaultSchema.attributes?.th || []), 'align'],
    td: [...(defaultSchema.attributes?.td || []), 'align'],
    a: [...(defaultSchema.attributes?.a || []), 'href', 'title', 'target', 'rel'],
  },
};

async function markdownToSafeHtml(markdown) {
  const file = await unified()
    .use(remarkParse)
    .use(gfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

// Mirror of the article TOC builder: give each <h2> a stable id and collect
// headings for an on-page table of contents (build-time, stays in static HTML).
function slugifyHeading(text, index) {
  const base = text
    .replace(/<[^>]+>/g, '')
    .replace(/[.,،:؛!؟"'(){}\[\]\-—…?]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
  return base ? `${base}-${index}` : `section-${index}`;
}

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
  const safeHtml = await markdownToSafeHtml(content);
  // Inject contextual internal links into the body. The `insight:<slug>` form
  // tells the autolinker this is an insight (so it won't self-link a /jadeed/
  // page to itself), while links still point OUT to /maqalat/ and /jadeed/.
  let contentHtml = addContextualLinks(safeHtml, `insight:${slug}`);
  const { html: withIds, toc } = addHeadingIdsAndToc(contentHtml);
  contentHtml = withIds;
  // Reading time, same formula as articles (~180 Arabic wpm).
  const plain = `${data.answer || ''} ${content}`.replace(/<[^>]+>/g, ' ');
  const words = plain.split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(2, Math.round(words / 180));
  return {
    slug,
    // `kind` lets shared code (related engine, cards) tell insights from
    // articles; `pillar` lets the related engine score cross-topic matches.
    kind: 'insight',
    meta: data, // { title, answer, date, updated, excerpt, category, pillar, reviewer, faq[], sources[] }
    contentHtml,
    toc,
    readingMinutes,
  };
}

export async function getAllInsights() {
  const slugs = getInsightSlugs();
  const insights = await Promise.all(slugs.map((s) => getInsight(s)));
  return insights
    .filter(Boolean)
    .sort((a, b) => (b.meta.date || '').localeCompare(a.meta.date || ''));
}

// Build-time list of the distinct categories across all insights, ordered by
// how many posts use each (most-used first). Drives the data-driven filter
// chips on the /jadeed/ index so the taxonomy never has to be hardcoded —
// new categories appear automatically as posts add them.
export async function getAllInsightCategories() {
  const insights = await getAllInsights();
  const counts = new Map();
  for (const it of insights) {
    const cat = (it.meta && it.meta.category ? String(it.meta.category) : '').trim();
    if (!cat) continue;
    counts.set(cat, (counts.get(cat) || 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([category, count]) => ({ category, count }));
}
