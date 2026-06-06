import { SITE, PILLARS } from '../lib/site';
import { getArticleSlugs } from '../lib/content';

export const dynamic = 'force-static';

export default function sitemap() {
  const now = new Date();
  const staticPages = ['', '/mahawir', '/maqalat', '/man-nahnu', '/man-nahnu/siyasat-al-tahrir', '/man-nahnu/al-masadir'];
  const pages = staticPages.map((p) => ({
    url: `${SITE.url}${p}/`,
    lastModified: now,
  }));
  const pillarPages = PILLARS.map((p) => ({
    url: `${SITE.url}/mahawir/${p.slug}/`,
    lastModified: now,
  }));
  const articlePages = getArticleSlugs().map((slug) => ({
    url: `${SITE.url}/maqalat/${slug}/`,
    lastModified: now,
  }));
  return [...pages, ...pillarPages, ...articlePages];
}
