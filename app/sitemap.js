import { SITE, PILLARS } from '../lib/site';
import { getArticleSlugs } from '../lib/content';
import { getGlossarySlugs } from '../lib/glossary';
import { getEnArticleSlugs } from '../lib/contentEn';

export const dynamic = 'force-static';

export default function sitemap() {
  const now = new Date();
  const staticPages = ['', '/mahawir', '/maqalat', '/mustalahat', '/man-nahnu', '/man-nahnu/siyasat-al-tahrir', '/man-nahnu/al-masadir'];
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
  const glossaryPages = getGlossarySlugs().map((slug) => ({
    url: `${SITE.url}/mustalahat/${slug}/`,
    lastModified: now,
  }));
  // English section
  const enStatic = ['/en', '/en/articles', '/en/about'].map((p) => ({
    url: `${SITE.url}${p}/`,
    lastModified: now,
  }));
  const enArticlePages = getEnArticleSlugs().map((slug) => ({
    url: `${SITE.url}/en/articles/${slug}/`,
    lastModified: now,
  }));
  return [...pages, ...pillarPages, ...articlePages, ...glossaryPages, ...enStatic, ...enArticlePages];
}
